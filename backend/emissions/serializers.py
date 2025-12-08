from rest_framework import serializers
from .models import Industry, Sector, EmissionData

class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = '__all__'

class SectorSerializer(serializers.ModelSerializer):
    industry_name = serializers.ReadOnlyField(source='industry.name')

    class Meta:
        model = Sector
        fields = ['id', 'name', 'description', 'industry', 'industry_name']

class EmissionDataSerializer(serializers.ModelSerializer):
    sector_name = serializers.ReadOnlyField(source='sector.name')
    industry_name = serializers.ReadOnlyField(source='sector.industry.name')

    class Meta:
        model = EmissionData
        fields = ['id', 'year', 'value', 'unit', 'sector', 'sector_name', 'industry_name']
