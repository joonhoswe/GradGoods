from django.db import models

class Listing(models.Model):
    owner = models.CharField(max_length=100)
    itemName = models.CharField(max_length=100)
    itemCategory = models.CharField(max_length=100)
    school = models.CharField(max_length=100)
    description = models.TextField()
    price = models.PositiveIntegerField()
    imageURLs = models.TextField()  # Storing the AWS URLs as a comma-separated string
    active = models.BooleanField(default=True)  # represents whether listing is active or not
    size = models.CharField(max_length=40, default='N/A')
