# Funcionalidades

La aplicación web permitirá a los usuarios visualizar el histórico de estadísticas de los celulares en Falabella. Para ello, se implementarán las siguientes funcionalidades:

- **Buscar celulares**: Los usuarios podrán buscar celulares por nombre o marca.
- **Visualizar histórico de precios y rating**: Los usuarios podrán visualizar el histórico de precios y rating de los celulares.

# Características

La aplicación web contará con las siguientes características:

- **Interfaz amigable**: La aplicación web contará con una interfaz amigable y fácil de usar.
- **Diseño responsivo**: La aplicación web será responsiva, es decir, se adaptará a cualquier dispositivo.
- **Latencia baja**: La aplicación web tendrá una latencia baja para una mejor experiencia de usuario.

# Arquitectura

La aplicación web estará compuesta por los siguientes componentes:

| Componente | Descripción | Tecnología cloud |
| ---------- | ----------- | ---------- |
| Web | Interfaz de usuario | Kubernetes pod en Google Cloud Platform |
| API Rest | Servicio de backend | Kubernetes pod en Google Cloud Platform |
| Scraper | Servicio de extracción de información | Kubernetes cronjob en Google Cloud Platform |
| Base de datos | Almacenamiento de información | PostgreSQL en Vercel |
