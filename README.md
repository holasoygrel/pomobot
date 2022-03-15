<h1 align="center">
 🍅 POMOBOT 🍅
</h1>

<p align="center">
  es una ramificación del bot de <a href="https://github.com/andreidimaano">Andrei Dimaano</a>
  Pomobot es un bot de discord basado en el <a href="https://es.wikipedia.org/wiki/T%C3%A9cnica_Pomodoro"> método de estudio Pomodoro,</a>
 totalmente en español. para añadirlo a tu server click <a href="https://discord.com/api/oauth2/authorize?client_id=856953402872692788&permissions=8&scope=bot%20applications.commands">AQUI</a>
</p>

# BUGS
- Poder iniciar un pomodoro individual desde el proceso de uno grupal y viceversa

# Ultimas actualizaciones:<br />
- Arreglado el bug de los grupos 
- Se agrego el ciclo pomodoro 
- Se cambio de Typescript a JS 
- Se migro a la version 13 de discordJS
- Se implemento el registro de los comandos de [/] ;D

# Todos los comandos:<br />

`% howto`<br />
`% pomodoro`<br />
`% pomodoro [tiempo]`<br />
`% pom`<br />
`% pom pom`<br />
`% pom [tiempo] descanso [tiempo]`<br />
`% grupo [tiempo]`<br />
`% cancelar`<br />
`% productividad`<br />
`% ayuda`<br />
`% sesionpomodoro`<br />
`% cancelsesion`<br />
`% sesiongrupal`<br />
`% cancelsesiongrupal` <br />

# Explicación de los comandos

### 🍅 Pomodoro<br/>

`% pomodoro`empieza un pomodoro con un tiempo preestablecido de 25 minutos<br/>
`% pomodoro [tiempo]` establece un pomodoro con duración con el tiempo introducido en minutos || el tiempo debe estar entre  10 min - 120 min<br/>
`% pom` empieza un pomodoro con un tiempo preestablecido de 25 minutos <br/>
`% pom [tiempo]` empieza un pomodoro en un tiempo ingresado<br />
`% pom pom` empieza un pomodoro de 50 minutos<br/>
`% pom [tiempo] break [tiempo]` establece un pomodoro un pomodoro en x tiempo con un descanso 
`% grupo [tiempo]` Empieza un pomodoro grupal <br/>
`% cancelar` cancela el pomodoro o tu tiempo de descanso <br/>

### 🍅 Sesion de Pomodoro<br/>
`% sesionpomodoro` Inicia una Sesion  Individual de pomodoro que se basa en 4 Pomodoros de 25 min con un descanso corto de 5 minutos entre ellos finalizando con un descanso largo de 15 minutos<br />
`% cancelsesion` Cancela la Sesion de pomodoro Individual <br />
`% sesiongrupal` Inicia una Sesion  Grupal de pomodoro que se basa en 4 Pomodoros de 25 min con un descanso corto de 5 minutos entre ellos finalizando con un descanso largo de 15 minutos<br />
`% cancelsesiongrupal` Cancela la Sesion de pomodoro grupal<br />

### Como configurar los canales para el Pomodoro Grupal:
1. Para poder ejecutar los comandos grupales se tiene que crear un Canal de texto que contenga la palabra 'pomobot'.
2. se tiene que crear un canal de voz con la palabra para que el comando funcione.
3. Se tiene que conectar al canal de voz.
4. Escribir en el canal el comando  ' % ' o ' / ' . 

### Reglas para usar el pomodoro grupal
1. Se debe tener un canal de texto separado que se llame 'pomobot'.
2. Debe de haber un canal de Voz que en el nombre contenga 'grupal'.
3. Tiene que estar conectado al canal de voz que contenga la palabra 'grupal'.
4. No puede haber un grupo de pomodoro en progreso.


### 📊 Productividad
Visualiza tus estadísticas, empieza a usar el bot y cada vez que termines un pomodoro se iran acumulando las horas que has trabajado, y para verlo tienes que escribir el comando
<br /><br />
`% productividad` este comando te va a retornar la cantidad total de horas trabajadas
<br />

### 🥇🥈🥉 Rangos<br/>
Puedes ver si has trabajado duro puedes consultar tu rango si estas entre los primeros tres mas productivos del servidor, escribiendo
<br /><br />
`% rangos` devuelve la lista de los 3 primeros en la tabla de rangos del server.
<br />

### :information_source: Ayuda<br/>
No sabes cuales son los comandos, puedes conocerlos con el comando de ayuda con el que puedes conocer la lista completa de comandos que puedes usar con el bot.
<br /><br />
`% ayuda` responde con la lista total de comandos.
<br />

### :information_source: ¿Como puedo para que sirve cada comando?
En el bot esta configurado un comando que lo explica de manera sencilla, despliega una lista con toda la explicación escribiendo el siguiente comando.
<br /><br />
`% howto` responde con la lista explicando los comandos.
<br />

### :coffee: Support us on Ko-fi! / Apoyanos en Ko-fi! 
Todo lo recaudado será utilizado para mantener vivo a este bot y hacer mejoras. ¡Toda ayuda es bienvenida! 

 [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y64LY9X)
