# Constructor de queries DEMO

Descripción...

## Proceso para ejecutar el proyecto:

1. Clonar el repositorio.
2. Instalación de dependencias
   ```bash
   $ npm install
   ```
3. Ejecutar comando para subir los containers de docker:

   ```bash
   $ docker-compose up
   ```

4. inicializar el servidor:

   ```bash
   $ npm start
   ```

5. Ejecutar seeds con una petición GET a **/api/seed/data-fake-generate**

## Consultas por el query builde:

Ruta de consulta: **/api/users**

Modelos asociados:

- `ClotheSizeUser`
- `Event`
- `PersonalInfo`
- `Project`

Para la configuración de campos que podemos consultar modificamos el objeto de configuración que se encuentra en el archivo `helpers\queryBuiler\User.queryBuilder.js`

El nombre de los campos debe ser el mismo que fue definido en el modelo y a cada campo se le debe asignar un tipo de dato que se encuentran previamente configurados en el objeto `helpers\queryBuilder.js - operatorTypes`, esto va a limitar los operadores que se puedan usar para distintos tipos de datos.

### Estructura del objeto principal

```javascript
{
    field1: typeOperator,
    field2: typeOperator,
    // ...
}
```

### Estructura de los modelos asociados

```javascript
{
    field: typeOperator,
    // FIELDS...,
    assosiations: {
        NAME_ASSOSIATION: {
            model: MODEL_ASSOSIATION,
            attributes: {
                FIELD_MODEL_ASSOSIATIONS: typeOperator
                // ...
            }
        }
    }
}
```

**IMPORTANTE:** El objeto de configuración debe contener la estructura planteada obligatoriamente, de lo contrario no se ejecutará correctamente.

### Parametros de consultas:

Los parametros que deben llegar a la ruta `api/users` deben venir de la misma forma en la que fue estructurado el objeto de configuración del query builder, ejemplo:

**Objeto de configuración**

```javascript
// Para modelo usuario
{
    name: operatorTypes.string,
    email: operatorTypes.string,
    assosiations: {
        personal_info: {
            model: PersonalInfo,
            attributes: {
                identification_number: operatorTypes.string,
            }
        }
    }
}
```

**Consulta:**

`/api/users/?name[is]=Samuel&email[contains]=samuel@&personal_info[identification_number][is]&=29333333`

Siguiendo esta estructura se puede consultar cualquier dato planteado.
