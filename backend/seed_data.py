import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from emissions.models import Industry, Sector, EmissionData

def seed():
    print("Seeding data...")
    EmissionData.objects.all().delete()
    Sector.objects.all().delete()
    Industry.objects.all().delete()

    industries = {
        'Energy': ['Power Generation', 'Oil & Gas', 'Coal Mining'],
        'Transportation': ['Aviation', 'Road Transport', 'Shipping'],
        'Manufacturing': ['Steel', 'Cement', 'Chemicals'],
        'Agriculture': ['Livestock', 'Crop Cultivation', 'Forestry']
    }

    years = range(2018, 2024)

    for ind_name, sectors in industries.items():
        industry = Industry.objects.create(name=ind_name, description=f"{ind_name} sector emissions")
        for sec_name in sectors:
            sector = Sector.objects.create(industry=industry, name=sec_name, description=f"Emissions from {sec_name}")
            
            # Generate realistic-looking data
            base_val = random.randint(100, 1000)
            for year in years:
                # Add some trend +/- 5%
                change = random.uniform(-0.05, 0.05)
                val = base_val * (1 + change)
                EmissionData.objects.create(
                    sector=sector,
                    year=year,
                    value=round(val, 2),
                    unit="Million Tons CO2e"
                )
                base_val = val

    print("Seeding complete.")

if __name__ == '__main__':
    seed()
