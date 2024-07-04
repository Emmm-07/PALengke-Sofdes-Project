from django.db import models
from django.contrib.auth.hashers import make_password,check_password

# Create your models here.
class Market(models.Model):
     item_id = models.CharField(max_length=10)
     item_name = models.CharField(max_length=50)
     item_categ = models.CharField(max_length=50)
     store = models.CharField(max_length=50)
     price = models.IntegerField()
     per = models.CharField(max_length=50)
     item_img = models.ImageField(blank=True)
     map_img = models.CharField(max_length=100,blank=True)

     def __str__(self):
          return f"{self.store} - {self.item_name}"
     
class Account(models.Model):
     admin_username = models.CharField(max_length=50)
     admin_password =models.CharField(max_length=128)

     def save(self,*args,**kwargs):
          if self.admin_password and not self.pk:
               self.admin_password = make_password(self.admin_password)
          super().save(*args, **kwargs)

     def __str__(self):
          return self.admin_username