# appML

## Requerimientos
- Instalar [Docker](https://docs.docker.com/get-docker/)

### Creación de containers

`docker-compose build`

### Levantar servicios

`docker-compose up -d`

La aplicacion esta configurada para el puerto 8080, en caso de cambiar esto, debe cambiarlo en la configuracion de la applicacion. 

## API list

### /api/mutant1 
Se encarga de detectar si un DNA que se le envia es Humano o Mutante (utilizando el metodo 1)

### /api/mutant2
Se encarga de detectar si un DNA que se le envia es Humano o Mutante, (utilizando el metodo 2)

### /api/mutant
Si no se especifica, va utilizar el metodo 2

### /api/stats
Devuelve la cantida de mutantes, de humanos y la relacion entre Mutantes/Humanos
	


Para mayor conocimiento de la aplicacion y de como se llevo acabo todo, tienen la siguiente documentacion disponible:
[Info](https://drive.google.com/file/d/1RZrn9nNPRFAUyShwk6tDLGDCAmOwm-rv/view?usp=sharing)


