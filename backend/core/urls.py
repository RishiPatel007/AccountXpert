"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from myapp.views import signup , login , createInvoice , listInvoice , delete_invoice , show_invoice , update_invoice , getProducts , addProduct , deleteProduct , updateProduct , get_clients , add_client , update_client , delete_client , search_client,get_personal_data , search_item , get_sales_data , get_monthly_sales_data , get_sales_forecast

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', signup),
    path('api/login/', login),
    path('api/create-invoice/', createInvoice),
    path('api/list-invoices/', listInvoice),
    path('api/delete-invoice/<str:invoice_id>/', delete_invoice),
    path('api/update-invoice/<str:invoice_id>/', update_invoice),
    path('api/show-invoice/<str:invoice_id>/', show_invoice),
    path('api/get-products/', getProducts),
    path('api/add-product/', addProduct),
    path('api/update-product/<str:product_id>/', updateProduct),
    path('api/delete-product/<str:product_id>/', deleteProduct),
    path("api/get-clients/", get_clients),
    path("api/add-client/", add_client),
    path("api/update-client/<str:client_id>/", update_client),
    path("api/delete-client/<str:client_id>/", delete_client),
    path('api/search-client/', search_client),
    path('api/search-item/', search_item),
    path('api/get-personal-data/', get_personal_data),
    path('api/monthly-sales-data/', get_monthly_sales_data),
    path('api/sales-data/', get_sales_data),
    path('api/sales-forecast/', get_sales_forecast),
]
