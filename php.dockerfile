FROM php:8.0-apache

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN apt-get update && apt-get install --yes zip unzip
RUN docker-php-ext-install mysqli pdo pdo_mysql
RUN a2enmod rewrite
