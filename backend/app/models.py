from django.db import models
from django.contrib.postgres.fields import ArrayField

class Listing(models.Model):
    #columns of the sqlite(soon to be postgresql database are defined here)
    #CharField(): used for string
    #PositiveIntegerField(): used for int
    owner = models.CharField(max_length=20, default='admin')
    emails = ArrayField(models.CharField(max_length=50, blank=True), blank=True, default = list)
    images = ArrayField(models.CharField(max_length=500, blank=True), blank=True, default = list)
    

    def __str__(self):
        return self.address