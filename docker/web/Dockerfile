FROM php:8.1-apache

# Configuration

## apache

RUN a2enmod rewrite headers

COPY apache2/conf-available/security.conf /etc/apache2/conf-available/security.conf
COPY apache2/sites-available/000-default.conf /etc/apache2/sites-available/000-default.conf
