# Funcionalidades

La aplicación web permitirá a los usuarios visualizar el histórico de estadísticas de los celulares en Falabella y
Entel. Para ello, se implementarán las siguientes funcionalidades:

- **Buscar celulares**: Los usuarios podrán buscar celulares por nombre o marca.
- **Visualizar histórico de precios**: Los usuarios podrán visualizar el histórico de precios de los celulares.

# Características

La aplicación web contará con las siguientes características:

- **Interfaz amigable**: La aplicación web contará con una interfaz amigable y fácil de usar.
- **Diseño responsivo**: La aplicación web será responsiva, es decir, se adaptará a cualquier dispositivo.
- **Latencia baja**: La aplicación web tendrá una latencia baja para una mejor experiencia de usuario.

# Arquitectura

La aplicación web estará compuesta por los siguientes componentes:

| Componente            | Descripción                                       | Tecnología cloud                          | Proveedor             |
|-----------------------|---------------------------------------------------|-------------------------------------------|-----------------------|
| GKE Cluster Autopilot | Cluster de Kubernetes                             | Kubernetes                                | Google Cloud Platform |
| Web                   | Interfaz de usuario                               | Kubernetes pod                            | Google Cloud Platform |
| API Rest              | Servicio de backend                               | Kubernetes pod                            | Google Cloud Platform |
| Typesense server      | Servicio de búsqueda                              | Kubernetes pod                            | Google Cloud Platform |
| Scraper               | Servicio de extracción de información             | Kubernetes cronjob                        | Google Cloud Platform |
| Search Engine Loader  | Servicio de carga de información para el buscador | Kubernetes cronjob                        | Google Cloud Platform |
| Cloud Load Balancer   | Balanceador de carga para servicios               | Load Balancer                             | Google Cloud Platform |
| External static IP    | IP estática para el balanceador de carga          | IP estática                               | Google Cloud Platform |
| Artifact Registry     | Registro de contenedores                          | Registro de artefactos                    | Google Cloud Platform |
| Cloud Build           | Servicio de construcción de contenedores          | CI/CD para construcción de artefactos     | Google Cloud Platform |
| Base de datos         | Almacenamiento de información                     | Base de datos PostgreSQL autoadministrada | Vercel                |

Un diagrama de la arquitectura propuesta se muestra a continuación:

![Arquitectura](./images/architecture.drawio.png)

# Uso de tecnologías cloud

Para el desarrollo de la aplicación web, se harán uso de los siguientes tópicos de cloud computing:

- **Kubernetes**: Kubernetes es una plataforma de código abierto que automatiza las operaciones de contenedores. En este caso, se utilizará Kubernetes para orquestar los contenedores de la aplicación web. Kubernetes permitirá escalar los contenedores de forma automática, lo que garantizará una alta disponibilidad de la aplicación web.
- **Load Balancer**: Un balanceador de carga distribuye el tráfico de red entre varios servidores. En este caso, se utilizará un balanceador de carga para distribuir el tráfico entre los contenedores de la aplicación web. El balanceador de carga garantizará que los contenedores reciban una cantidad equitativa de tráfico, lo que mejorará el rendimiento de la aplicación web.
- **Container Registry**: Un Container Registry es un servicio que permite almacenar, gestionar y distribuir imágenes de contenedores. En este caso, se utilizará un servicio de Google Cloud Platform llamado Artifact Registry con el fin de almacenar las imágenes de los contenedores de la aplicación web. Artifact Registry garantizará que las imágenes de los contenedores estén disponibles y sean seguras.