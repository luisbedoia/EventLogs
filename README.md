# Event Logs Service

## 📌 Descripción
Este proyecto es un servicio de registro de eventos basado en Node.js con PostgreSQL y RabbitMQ. Se ejecuta con `docker-compose` para facilitar su despliegue y administración.

---

## 🚀 **Requisitos previos**
Antes de ejecutar el proyecto, asegúrate de tener instalado:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 🛠 **Instrucciones de ejecución**
Para iniciar el servicio, simplemente ejecuta:

```sh
docker-compose up --build
```
Esto iniciará los siguientes contenedores:
- `event-logs`: Servicio principal que gestiona eventos.
- `postgres`: Base de datos PostgreSQL.
- `dbmate`: Aplicación para manejar migraciones de base de datos.
- `rabbit`: Servidor de mensajería RabbitMQ.

Para detener y eliminar los contenedores, usa:

```sh
docker-compose down
```

---

## 🔌 **Servicios y Configuración**
### 🌐 Puertos expuestos
- **`event-logs`**: `3000` (API REST)
- **`postgres`**: `5432` (Base de datos PostgreSQL)
- **`rabbit`**: `5672` (RabbitMQ), `15672` (Panel de administración de RabbitMQ)

### 📂 Variables de entorno
El servicio `event-logs` requiere las siguientes variables de entorno:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
RABBITMQ_URL=amqp://admin:admin@rabbit:5672/
```

---

## 📡 **Ejemplos de Requests**
Puedes interactuar con la API usando `curl`.

### 📌 Crear un evento (form-urlencoded)
```sh
curl --location 'http://localhost:3000/events' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'description=A new event from form curl'
```

### 📌 Crear un evento (JSON)
```sh
curl --location 'http://localhost:3000/events' \
--header 'Content-Type: application/json' \
--data '{
    "description": "A new event from JSON curl"
}'
```

### 📌 Obtener un evento por ID
```sh
curl --location 'http://localhost:3000/events/1'
```

### 📌 Obtener eventos con filtros
```sh
curl --location 'http://localhost:3000/events?type=API&page=1&from=2025-03-20&limit=5&to=2025-03-28'
```

---

## 📊 **Administración de RabbitMQ**
Puedes acceder a la interfaz de administración de RabbitMQ en:

🔗 [http://localhost:15672](http://localhost:15672)

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin`

---

## 📌 **Migraciones de Base de Datos**
`dbmate` se encarga de gestionar las migraciones automáticamente cuando se levanta el servicio. Si necesitas aplicarlas manualmente, ejecuta:

```sh
docker-compose run --rm dbmate up
```

---

## 📖 **Notas adicionales**
- Para ver los logs del servicio, usa:
  ```sh
  docker logs -f event-logs
  ```
- Para conectarte a la base de datos:
  ```sh
  docker exec -it postgres-event-logs psql -U admin
  ```

---

## 📌 **Licencia**
Este proyecto se distribuye bajo la licencia MIT.

