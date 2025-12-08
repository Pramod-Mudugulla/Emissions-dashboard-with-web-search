from django.db import models

class Industry(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Sector(models.Model):
    industry = models.ForeignKey(Industry, related_name='sectors', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ('industry', 'name')

    def __str__(self):
        return f"{self.industry.name} - {self.name}"

class EmissionData(models.Model):
    sector = models.ForeignKey(Sector, related_name='emissions', on_delete=models.CASCADE)
    year = models.IntegerField()
    value = models.FloatField(help_text="Emissions value in tons of CO2e")
    unit = models.CharField(max_length=50, default="tons CO2e")

    class Meta:
        ordering = ['year']

    def __str__(self):
        return f"{self.sector.name} ({self.year}): {self.value} {self.unit}"
