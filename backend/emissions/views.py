from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import Industry, Sector, EmissionData
from .serializers import IndustrySerializer, SectorSerializer, EmissionDataSerializer

class IndustryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer

class SectorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sector.objects.all()
    serializer_class = SectorSerializer

class EmissionDataViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EmissionData.objects.all()
    serializer_class = EmissionDataSerializer
    filterset_fields = ['sector', 'year']

    @action(detail=False, methods=['get'])
    def summary(self, request):
        # Aggregated data for charts
        data = EmissionData.objects.all()
        # You can add aggregation logic here if needed
        serializer = self.get_serializer(data, many=True)
        return Response(serializer.data)

from google import genai
from google.genai import types
import environ

env = environ.Env()
environ.Env.read_env()  # reads .env file
GEMINI_API_KEY = env("GEMINI_API_KEY")


class ChatViewSet(viewsets.ViewSet):
    def create(self, request):
        query = request.data.get('query', '')
        
        # 1. Retrieve Context from Database
        total_emissions = EmissionData.objects.aggregate(models.Sum('value'))['value__sum']
        top_sector = EmissionData.objects.values('sector__name').annotate(total=models.Sum('value')).order_by('-total').first()
        
        context_str = f"""
        Internal Database Summary:
        - Total Emissions Recorded: {round(total_emissions, 2) if total_emissions else 0} Million Tons CO2e.
        - Highest Emitting Sector: {top_sector['sector__name'] if top_sector else 'N/A'}.
        """

        # 2. Setup Gemini with Google Search Grounding
        api_key = GEMINI_API_KEY
        if not api_key:
            return Response({'response': "Error: GEMINI_API_KEY is not configured in the backend .env file. Please check settings."})

        try:
            # Initialize the new genai client
            client = genai.Client(api_key=api_key)
            
            # Configure Google Search grounding tool
            grounding_tool = types.Tool(
                google_search=types.GoogleSearch()
            )
            
            config = types.GenerateContentConfig(
                tools=[grounding_tool],
                system_instruction=f"""You are an AI assistant for Stride Labs, an emissions tracking platform.
You have access to real-time web search to find current information about emissions, climate change, and environmental topics.

When answering questions:
1. Use the internal database context when relevant to the user's specific data
2. Use web search to find current news, statistics, and insights about global emissions
3. Always cite sources when using web-searched information
4. Be helpful and provide actionable insights

Internal Database Context:
{context_str}"""
            )
            
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=query,
                config=config,
            )
            
            # Extract sources from grounding metadata if available
            sources = []
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate, 'grounding_metadata') and candidate.grounding_metadata:
                    metadata = candidate.grounding_metadata
                    if hasattr(metadata, 'grounding_chunks') and metadata.grounding_chunks:
                        for chunk in metadata.grounding_chunks:
                            if hasattr(chunk, 'web') and chunk.web:
                                sources.append({
                                    'title': chunk.web.title if hasattr(chunk.web, 'title') else 'Source',
                                    'uri': chunk.web.uri if hasattr(chunk.web, 'uri') else ''
                                })
            
            response_data = {
                'response': response.text,
                'sources': sources[:5]  # Limit to 5 sources
            }
            
            return Response(response_data)
            
        except Exception as e:
            return Response({'response': f"LLM Error: {str(e)}", 'sources': []})
