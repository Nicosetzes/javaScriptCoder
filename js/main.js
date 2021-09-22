// Incorporo animaciones. Pruebo a realizarlas sobre el ID message:

$("#message").fadeOut(2500 , () => {
    $("#message").fadeIn(2500)
                 .delay(2000)
                 .css("color" , "blue")
                 .fadeOut(2500)
                 .fadeIn(2500)
})

// Declaración de arrays. Utilizo let para permitir que cambie su valor (debido al uso de localStorage)

let donationsNumber = []  // Declaro un array vacío, con la cantidad de donaciones.

$("#sum").append(`0`)  // Escribo el contenido de esa linea de HTML, el valor se irá actualizando en función de la cantidad de donaciones.

let donationsUsersList = []  // Declaro un array vacío, con los usuarios que donaron.

$("#users").append(`-`)  // Escribo el contenido de esa linea de HTML, el valor se irá actualizando en función de los usuarios que donan.

// Chequeo el localStorage, en caso de haber algo en la memoria ya lo inyecto en el HTML (luego de reconvertirlo del formato JSON si es necesario).

if(localStorage.donationsNumber != null){
    donationsNumber = JSON.parse(localStorage.donationsNumber) 
    $("#sum").html(donationsNumber.length) 
}

if(localStorage.donationsUsersList != null){
    donationsUsersList = JSON.parse(localStorage.donationsUsersList) 
    $("#users").html(donationsUsersList)
}

// Creo la class Story, que la utilizo para generar mis objetos (en este caso, mis cuentos). 

// También le defino un método, que permite la donación específica para cada cuento.

class Story {

    constructor(title, author, length, date, text) {
        this.title = title;
        this.author = author;
        this.length = length;
        this.date = date;
        this.text = text;
    }

    specificDonation = (story) => {

        document.getElementById("form").classList.add("form")

        $("#form").html( `<div class="extraInfo">
                                                        <p>El cuento seleccionado es <span class="italic">${story.title}</span>. Le proporcionamos información extra acerca del mismo:</p>
                                                        <p><b>Autor</b>: ${story.author}</p>
                                                        <p><b>Cantidad de palabras</b>: ${story.length}</p>
                                                        <p><b>Fecha de realización</b>: ${story.date}</p>
                                                     </div>
                                                     <p>Agradecido por su intención de contribuir por <span class="italic">${story.title}</span>. ¿Cuál es tu nombre?</p>
                                                     <input id="name" class="formItem" type="text">
                                                     <p>Estimado usuario, ingrese la cantidad a donar. ¡Cualquier contribución es bienvenida!:</p>
                                                     <input id="amount" class="formItem" type="text">
                                                     <input type="reset"><input type="submit">`)

    }
}

let myForm = $("#form") // Accedo medianto DOM al formulario y lo guardo en la variable myForm

myForm.on("submit",  function sendForm(event) {

    event.preventDefault(); // Evito que al enviar el form este se comporte por defecto, osea que recargue la página.

    let user = $("#name").val()  // Almaceno el valor del input name dentro de una variable llamada user. Utilizo el método .val() de Jquery

    console.log(user)

    donationsNumber.push(user)  // Agrego el valor del form (user) al array donationsNumber.

    localStorage.donationsNumber = JSON.stringify(donationsNumber) // Defino un elemento dentro del localStorage, que será el array donationsNumber pero parseado.

    $("#sum").html(donationsNumber.length)  // Inyecto en el HTML la cantidad de donaciones.

    let donationsUsersList = donationsNumber.join(`, `) // Convierto el array donationsUsersList a string y separo sus elementos por una coma y un espacio. Representará los users que donaron.

    localStorage.donationsUsersList = JSON.stringify(donationsUsersList) // Defino un elemento dentro del localStorage, que será el array donationsUsersList pero parseado.

    $("#users").html(donationsUsersList)  // Lo inyecto en el HTML

})

// Creo mis objetos, que son mis cuentos. Defino propiedades como su título, autor, cantidad de palabras y año de realización.

const shortStoryOne = new Story("De paso", "Nicolás Setzes", 417, 2020, `<article class="articleOne">
                                                                                        <h3>De paso</h3>
                                                                                        <div class="columns">
                                                                                <p class="mainText">—Papi, tengo hambre.</p>
                                                                                <p class="mainText">Mamá sabe que le pido a papá porque a ella no le gusta darme después del almuerzo.</p>
                                                                                <p class="mainText">—Mi amor, recién terminás —dice papá.</p>
                                                                                <p class="mainText">—Pero tengo hambre y ya no hay más acá, mirá —les muestro mi plato favorito limpio.</p>
                                                                                <p class="mainText">Mamá me hace un jugo de esos que me encantan, bien dulce. El conejito de la mamadera
                                                                                    me sonríe cuando estoy tomando. Mamá está mirando un partido en la tele, papá escribe muy rápido en
                                                                                    la compu. Sé que está trabajando porque tiene su cara rara de concentración, por eso voy con mamá.
                                                                                    Ella me abraza y miramos como la pelota rebota y va de lado a lado. Cuando la cámara se acerca los
                                                                                    jugadores tienen esa cara que pone papá. El calor de mamá y la luz de la pantalla me dan sueño. </p>
                                                                                <p class="mainText">Me lleno la boca de jugo y me quedo así. Mamá se ríe de mis cachetes y le dice a
                                                                                    papá, papá viene y me saca una foto. Vino muy rápido y se va un poco más lento, mamá tose. </p>
                                                                                <p class="mainText">Ahora dan el noticiero de la noche. La pantalla es más grande que la anterior, tiene
                                                                                    más botones y es rectangular, me gusta más que la otra así que no digo nada. Va quedando menos jugo.
                                                                                    Mamá ahora tiene más arrugas en su cara, como las de mi abuela pero tampoco tantas. Papá sigue
                                                                                    tecleando fuerte en la computadora.</p>
                                                                                <p class="mainText">Otro trago al vaso que sostengo y mamá cambió de canal, mucha gente gritándose y
                                                                                    discutiendo del marido de no sé qué mujer. Mamá entorna los ojos a través de sus lentes y está más
                                                                                    inclinada hacia adelante, le pesa un poco la espalda. De vez en cuando tose fuerte cuando le grita a
                                                                                    la televisión, como si los panelistas pudieran escucharla. Me gustaría que dejara de hacerlo, pero
                                                                                    tampoco quiero contradecirla. </p>
                                                                                <p class="mainText">Veo que mi padre sigue tecleando. Me vuelvo para mirar a mamá pero ya no está, no la
                                                                                    veo por ninguna parte. Estoy solo en el sillón, por lo que ahora me apoyo en el respaldo. Inclino el
                                                                                    vaso y comienzo a tomar la leche más despacio, le puse mucho cacao y ya me empieza a empalagar. </p>
                                                                                <p class="mainText">Mi madre sigue sin aparecer. ¿Dónde está mamá? Mi padre ahora está acostado en algún
                                                                                    lugar, y siento que lo tengo que visitar. Aprovecho que mis brazos son más largos ahora y apoyo la
                                                                                    taza de café en la mesita. Desconozco si alguna vez me acostumbraré al sabor, pero ayuda a
                                                                                    mantenerse despierto. </p>
                                                                            </div>
                                                                            </article>`)

const shortStoryTwo = new Story("La viola", "Nicolás Setzes", 238, 2014, `<article class="articleTwo">
                                                                            <h3>La viola</h3>
                                                                            <div class="columns">
                                                                                <p class="mainText">Unas notas, en compás. Talento inusitado, como de cuna. Día comienza mas afuera un
                                                                                    ocaso brillante. Necesita cambio. Se obliga salir y comenzar pues el oficio no permite. Avanza,
                                                                                    avanza, retrocede. La viola. Lo considera una señal de que será distinto. La llegada es como si
                                                                                    nunca. Señal. Toca en mismo compás y aclaman, miradas vuelan y audiencia delira. Sin duda es uno con
                                                                                    la viola, domina la maestría de ser con ella. Su amor. Se espera en revistas y diarios como el gran
                                                                                    músico que demostró. Denota que le pesa la presión de aparentar. Cambio.</p>
                                                                                <p class="mainText">Retorna con gloria, aunque no tanto. Los pensamientos se le arremolinan como cuando
                                                                                    un tornado. Es un viaje largo, tal cual travesía. Siente poder degollar con mirada asesina. Siente
                                                                                    culpable por lluvia ácida. A kilómetros, luz interrumpe. Se le viene ballena más grande y atardecer
                                                                                    rojo. Recuerda las señales. Plantas próximas a la ruta intentan escape por aullido atroz. La maldita
                                                                                    noche lo quiere atrapar, a su ser ha descubierto. Auto abandonado, ahora parsimonia al caminar por
                                                                                    la banquina y descubrir silueta esbelta, tímida, sóla. Pregunta dirección con cuidado, confía y se
                                                                                    va. La experiencia le ayuda, sabe cómo es. Avanza, avanza, retrocede y la viola, la viola, la viola.
                                                                                    La luna sin intención revela detalles como si crítico musical estuviera. Se pregunta si, se contesta
                                                                                    no. Entusiasmado corre, pues se sabe más vivo que nunca. El personaje cayó, la persona no.</p>
                                                                            </div>
                                                                            </article>`)

const shortStoryThree = new Story("Fuera de tiempo", "Nicolás Setzes", 356, 2021, `<article class="articleThree">
                                                                                    <h3>Fuera de tiempo</h3>
                                                                                    <div class="columns">
                                                                                        <p class="mainText">Ver la luz a eso de las nueve. Observar la pared hasta las diez. Incorporarse, sentir el frío de cabeza a pies. Entrar en la cocina y comer una tostada pelada, sin vestirse. Percatarse. Preguntarse si volver a dormir. Negar, volver a intentarlo.</p>
                                                                                        <p class="mainText">Para las doce, comer otra tostada. Esta es con queso, disfrutar la tostada. Hoy es viernes, así que pedir una hamburguesa. Pagar con tarjeta y solicitar que se deje en la entrada. Volver a la silla hasta escuchar el timbre. Esperar cinco minutos y abrir. El chico <span class="italic">está</span> ahí. Descubrir que no tiene rasgos, no tiene cara. Tomar la hamburguesa y entrar. Servir un vaso de agua, comer en silencio. Sentir el vacío aun con hamburguesa. Pensar en los –no– rasgos del chico. Preguntarse realmente si esto no amerita volver a dormir. Negar, volver a intentarlo.</p>
                                                                                        <p class="mainText">Lavar el plato y el vaso de ayer. Sostener el cuchillo en el aire, pensar. Lavarlo y dejarlo con lo demás. Olvidarse del tenedor y entrar al living. Sentarse en una silla, prender el televisor. Cambiar de canal, no pestañear. Preguntarse si volver a dormir.</p>
                                                                                        <p class="mainText">Ir al living. Descubrir la ventana y observar por ella después de tanto. Permanecer inmóvil, ver al mundo continuar:</p>
                                                                                        <p class="mainText">1) A las aves volar.</p>
                                                                                        <p class="mainText">2) A las nubes chocar, fusionarse y cambiar de color, provocar la lluvia.</p>
                                                                                        <p class="mainText">3) A los perros orinar, a los <span class="italic">homeless</span> mendigar –y viceversa–. </p>
                                                                                        <p class="mainText">4) A la gente –aun sin rostro– caminar, a los autos –de dos y cuatro ruedas– conducir.</p>
                                                                                        <p class="mainText">5) A los conductores insultar, disfrutar con ello.</p>
                                                                                        <p class="mainText">6) A los empresarios correr, atropellar otra gente –los muy hijos de puta–.</p>
                                                                                        <p class="mainText">7) Y a mí mismo, porque tomar distancia de la ventana y observar mi reflejo desencajado, atónito, tan <span class="italic">outsider</span> del mundo como la <span class="italic">nani</span> que ya no está. Preguntarse si volver a dormir. </p>
                                                                                        <p class="mainText">Ver que son las siete. Ir a la habitación sin lavarse los dientes ni apagar la televisión. Sacarse la ropa y meterse entre las sábanas. Traerla por un momento, masturbarse rápido y escuchar el alboroto de la cama. Permanecer ahí, observar la pared hasta las diez. Preguntarse si volver a dormir.</p>
                                                                                    </div>
                                                                                    </article>`)

const shortStories = [shortStoryOne , shortStoryTwo , shortStoryThree]  // Defino un array que contendrá los cuentos (stories) completos

// Recorro el array con el uso del método forEach

let accumulator = ``;

shortStories.forEach(story => {
    accumulator += `${story.text}`
});

// Utilizo DOM para añadir los articles (conteniendo los cuentos) al HTML. 

$("#containerTwo").append(accumulator)