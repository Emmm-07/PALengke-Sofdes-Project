from django.urls import path
from . import views


from django.conf.urls.static import static
from django.conf import settings

app_name = 'myapp'

urlpatterns = [
    path('', views.start_pg,name="start_pg"),
    path('verify_account/', views.verify_account,name="verify_account"),
    path('login_pg/', views.login_pg,name="login_pg"),
    path('menu/', views.menu,name="menu"),
    path('get_categ/', views.get_categ,name="get_categ"),
    path('get_item_name/', views.get_item_name,name="get_item_name"),
    
    path('category/', views.category,name="category"),
    path('store/', views.store,name="store"),

    path('database/',views.database,name="database"),
    path('database/add_item/',views.add_item,name="add_item"),
    path('database/edit_item/',views.edit_item,name="edit_item"),
    path('database/delete_item/',views.delete_item,name="delete_item"),
    path('database/filter_table/',views.filter_table,name="filter_table"),

    # path('upload/', views.upload_file, name='upload_file'),
]
