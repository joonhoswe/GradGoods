from django.db import models
from django.contrib.postgres.fields import ArrayField

class Listing(models.Model):
    #columns of the sqlite(soon to be postgresql database are defined here)
    #CharField(): used for string
    #PositiveIntegerField(): used for int
    owner = models.CharField(max_length=20, default='admin')
    itemName = models.CharField(max_length=40, default='An Item')
    itemCategory = models.CharField(max_length=40, default='A Category')
    school = models.CharField(max_length=80, default='School')
    description = models.CharField(max_length=1000, default='Description')
    price = models.PositiveIntegerField(default ='0')
    imageURLs = ArrayField(models.CharField(max_length=500, blank=True), blank=True, default = list)
    
    def __str__(self):
        return self.address