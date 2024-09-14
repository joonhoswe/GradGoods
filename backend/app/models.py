from django.db import models

class Listing(models.Model):
    # Columns of the SQLite (soon to be PostgreSQL) database are defined here
    owner = models.CharField(max_length=20, default='admin')
    itemName = models.CharField(max_length=40, default='An Item')
    itemCategory = models.CharField(max_length=40, default='A Category')
    school = models.CharField(max_length=80, default='School')
    description = models.CharField(max_length=1000, default='Description')
    price = models.PositiveIntegerField(default='0')
    
    # Temporarily replace ArrayField with TextField for SQLite compatibility
    imageURLs = models.TextField(blank=True, default='')  # Store URLs as a comma-separated string

    def __str__(self):
        return self.itemName
