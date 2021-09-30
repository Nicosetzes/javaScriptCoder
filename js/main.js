// Incorporo animaciones. Pruebo a realizarlas sobre el ID message:

$("#message").fadeOut(2500, () => {
    $("#message").fadeIn(2500)
        .delay(2000)
        .css("color", "blue")
        .fadeOut(2500)
        .fadeIn(2500)
})

// Declaración de arrays. Utilizo let para permitir que cambie su valor (debido al uso de localStorage)

let donationsNumber = []  // Declaro un array vacío, con la cantidad de donaciones.

$("#sum").append(`0`)  // Escribo el contenido de esa linea de HTML, el valor se irá actualizando en función de la cantidad de donaciones.

let donationsUsersList = []  // Declaro un array vacío, con los usuarios que donaron.

$("#users").append(`-`)  // Escribo el contenido de esa linea de HTML, el valor se irá actualizando en función de los usuarios que donan.

// Chequeo el localStorage, en caso de haber algo en la memoria ya lo inyecto en el HTML (luego de reconvertirlo del formato JSON si es necesario).

if (localStorage.donationsNumber != null) {
    donationsNumber = JSON.parse(localStorage.donationsNumber)
    $("#sum").html(donationsNumber.length)
}

if (localStorage.donationsUsersList != null) {
    donationsUsersList = JSON.parse(localStorage.donationsUsersList)
    $("#users").html(donationsUsersList)
}

// Creo la class Story, que la utilizo para generar mis objetos (en este caso, mis cuentos). 

// También le defino un método, que permite la donación específica para cada cuento.

class Story {

    constructor(title, value, author, length, date, text) {
        this.title = title;
        this.value = value;
        this.author = author;
        this.length = length;
        this.date = date;
        this.text = text;
    }

    specificDonation = (story) => {

        document.getElementById("form").classList.add("form")

        $("#form").html(`<div class="extraInfo">
                                                        <p>El cuento seleccionado es <span class="italic">${story.title}</span>. Le proporcionamos información extra acerca del mismo:</p>
                                                        <p><b>Autor</b>: ${story.author}</p>
                                                        <p><b>Cantidad de palabras</b>: ${story.length}</p>
                                                        <p><b>Fecha de realización</b>: ${story.date}</p>
                                                     </div>
                                                     <p>Agradecido por su intención de contribuir por <span class="italic">${story.title}</span>. ¿Cuál es tu nombre?</p>
                                                     <input id="name" class="formItem" type="text">
                                                     <p>Actualmente, puede contribuir a través de la plataforma Mercado Pago.</p>
                                                     <p>Estimado usuario, ingrese la cantidad a donar. ¡Cualquier contribución es bienvenida!:</p>
                                                     <input id="amount" class="formItem" type="text">
                                                     <div id="submitAndReset"><input type="reset"><input type="submit"></div>
                                                     <p id="linkMercadoPago"></p>`)

    }

}

// Declaro una función llamada payment, que se ejecutará en la linea 148. Con esta función realizo la llamada AJAX e utilizo la api de mercadopago para generar un link de pago. 

payment = (amount) => {

    // Utilizo la api de Mercado Pago para procesar pagos en mis sitios (las donaciones)

    // Primero, defino una constante llamada donation, que será un objeto. Ella contendrá el valor de la donación (en su propiedad price).

    const donation = {
        quantity: 1,
        price: amount
    }

    const donationList = [donation];   // Luego creo un array llamado donationList, que contendrá el objeto donation.

    // Utilizo el método de array .map() para recorrer el array y retornar las propiedades requeridas por mercadopago. Me aseguro de que price y quantity estén presentes.

    const mercadoPagoDonations = donationList.map(x => {
        return {
            "title": "Donación",
            "description": "",
            "picture_url": "",
            "category_id": "",
            "quantity": x.quantity,
            "currency_id": "ARS",
            "unit_price": x.price
        }
    })

    // Guardo en una constante la donación a realizar:

    const element = { "items": mercadoPagoDonations }

    // Declaro los headers de la llamada AJAX en formato Jquery.

    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer TEST-1051685759572271-092221-2f4ba1fef5215e2eff5d87c2c4764924-169071117',
            'Content-Type': 'application/json'
        }
    });

    // Realizo la llamada POST en formato Jquery.

    $.post("https://api.mercadopago.com/checkout/preferences", JSON.stringify(element), (respuesta, status) => {

        if (status === "success") {

            const donationLink = respuesta.init_point   // Guardo la propiedad init_point de la respuesta del POST en una constante llamada donationLink (es el link de mercadopago)

            $("#linkMercadoPago").html(`<a href="${donationLink}" target="_blank">Presione aquí para abonar por Mercado Pago</a>`) // Lo hago aparecer en el html
        }
    })
}

// Ahora toca escribir el Js correspondiente al evento asociado al envío del formulario (y su función callback)

let myForm = $("#form") // Accedo medianto DOM al formulario y lo guardo en la variable myForm
// TODO: que los valores no se guarden cuando sean un campo vacío. Agregar clase para indicar el error y prevenir que se envíe el formulario.
myForm.on("submit", function sendForm(event) {

    event.preventDefault(); // Evito que al enviar el form este se comporte por defecto, osea que recargue la página.

    let user = $("#name").val()  // Almaceno el valor del input name dentro de una variable llamada user. Utilizo el método .val() de Jquery

    donationsNumber.push(user)  // Agrego el valor del form (user) al array donationsNumber.

    localStorage.donationsNumber = JSON.stringify(donationsNumber) // Defino un elemento dentro del localStorage, que será el array donationsNumber pero parseado.

    $("#sum").html(donationsNumber.length)  // Inyecto en el HTML la cantidad de donaciones.

    let donationsUsersList = donationsNumber.join(`, `) // Convierto el array donationsUsersList a string y separo sus elementos por una coma y un espacio. Representará los users que donaron.

    localStorage.donationsUsersList = JSON.stringify(donationsUsersList) // Defino un elemento dentro del localStorage, que será el array donationsUsersList pero parseado.

    $("#users").html(donationsUsersList)  // Lo inyecto en el HTML

    let value = Number($("#amount").val()); // Almaceno el valor del input amount dentro de una variable llamada value. Utilizo el método .val() de Jquery

    payment(value) // Ejecuto la función payment(), a la que le paso como parámetro el value obtenido en la linea anterior (monto a donar por el usuario).

})

// Creo mis objetos, que son mis cuentos. Defino propiedades como su título, autor, cantidad de palabras y año de realización.

const sinEmbalar = new Story("Sin Embalar", "sinEmbalar", "Nicolás Setzes", 270, 2020,    `<article class="shortStory">
                                                                                                <h3>Sin embalar</h3>
                                                                                                <div class="columns">
                                                                                                    <p class="mainText">Te reconozco que nunca te vi como un ser de fundamentos, una persona que se sentara a contar ladrillos y estudiar la geometría que resulta, esto implica que podía maravillarte con un esfuerzo más bien mínimo, pero certero. Existen técnicas de todo tipo, más aun si la intención es solo impresionar al prójimo, a la compañía. Era la mejor manera de empezar mí día, contemplando el afecto que venía de tu admiración. El ritual era sagrado e inamovible: aun puedo sentir el olor a café –y de mi ya clásico té de limón–, las pantuflas y las cortinas corridas –por si pintaba–.</p>
                                                                                                    <p class="mainText">Comenzaba en ocasiones con mi mano izquierda, indicándole que configure una forma sencilla, pero conmovedora. La música no dejaba lugar para nada más. Ahora empiezo con la derecha, pues sobre gustos no hay nada escrito, ya sabés. La transferencia emocional es un proceso complejo, un duelo absoluto, y reescribir un nombre en la historia forma parte del mismo.</p>
                                                                                                    <p class="mainText">Te reconozco, que nunca te vi como un ser de fundamentos, una persona que se sentara a contar ladrillos y estudiar la geometría resultante, esto no implica que te viera como un ser sencillo, ni por debajo de ninguna línea imaginaria. Tocar el teclado bajo la influencia de un olor distinto al café no hace más que revivir ciertas sensaciones, invisibles durante nuestro affaire. Todo este delirio en prosa para decir aquello que nunca te dije, casi que puedo verte apoyada en mis piernas llamándome un cobarde, pero me quedo sin tiempo y debo componer otra pieza antes de que me alcance el sol de un nuevo amanecer.</p>
                                                                                                </div>
                                                                                            </article>`)

const dePaso = new Story("De paso", "dePaso", "Nicolás Setzes", 417, 2020, `<article class="shortStory">
                                                                                <h3>De paso</h3>
                                                                                <div class="columns">
                                                                                    <p class="mainText">—Papi, tengo hambre.</p>
                                                                                    <p class="mainText">Mamá sabe que le pido a papá porque a ella no le gusta darme después del almuerzo.</p>
                                                                                    <p class="mainText">—Mi amor, recién terminás —dice papá.</p>
                                                                                    <p class="mainText">—Pero tengo hambre y ya no hay más acá, mirá —les muestro mi plato favorito limpio.</p>
                                                                                    <p class="mainText">Mamá me hace un jugo de esos que me encantan, bien dulce. El conejito de la mamadera me sonríe cuando estoy tomando. Mamá está mirando un partido en la tele, papá escribe muy rápido en la compu. Sé que está trabajando porque tiene su cara rara de concentración, por eso voy con mamá. Ella me abraza y miramos como la pelota rebota y va de lado a lado. Cuando la cámara se acerca los jugadores tienen esa cara que pone papá. El calor de mamá y la luz de la pantalla me dan sueño.</p>
                                                                                    <p class="mainText">Me lleno la boca de jugo y me quedo así. Mamá se ríe de mis cachetes y le dice a papá, papá viene y me saca una foto. Vino muy rápido y se va un poco más lento, mamá tose. </p>
                                                                                    <p class="mainText">Ahora dan el noticiero de la noche. La pantalla es más grande que la anterior, tiene más botones y es rectangular, me gusta más que la otra así que no digo nada. Va quedando menos jugo. Mamá ahora tiene más arrugas en su cara, como las de mi abuela pero tampoco tantas. Papá sigue tecleando fuerte en la computadora.</p>
                                                                                    <p class="mainText">Otro trago al vaso que sostengo y mamá cambió de canal, mucha gente gritándose y discutiendo del marido de no sé qué mujer. Mamá entorna los ojos a través de sus lentes y está más inclinada hacia adelante, le pesa un poco la espalda. De vez en cuando tose fuerte cuando le grita a la televisión, como si los panelistas pudieran escucharla. Me gustaría que dejara de hacerlo, pero tampoco quiero contradecirla. </p>
                                                                                    <p class="mainText">Veo que mi padre sigue tecleando. Me vuelvo para mirar a mamá pero ya no está, no la veo por ninguna parte. Estoy solo en el sillón, por lo que ahora me apoyo en el respaldo. Inclino el vaso y comienzo a tomar la leche más despacio, le puse mucho cacao y ya me empieza a empalagar. </p>
                                                                                    <p class="mainText">Mi madre sigue sin aparecer. ¿Dónde está mamá? Mi padre ahora está acostado en algún lugar, y siento que lo tengo que visitar. Aprovecho que mis brazos son más largos ahora y apoyo la taza de café en la mesita. Desconozco si alguna vez me acostumbraré al sabor, pero ayuda a mantenerse despierto. </p>
                                                                                </div>
                                                                            </article>`)
                                                                    
const nodos = new Story("Nodos", "nodos", "Nicolás Setzes", 1307, 2021, `<article class="shortStory"">
                                                                            <h3>Nodos</h3>
                                                                            <div class="columns">
                                                                                <p class="mainText">Los sueños son una poderosa herramienta a la hora de estudiar distintas <span class="italic">configuraciones</span> de la realidad. A modo de ilustrar con el ejemplo, puedo contarles que ciertas imágenes me visitaron durante la noche anterior, aunque no permanecieron separadas durante mucho tiempo. Se observaron detenidamente, unos instantes, como midiéndose. Ahora, ¿quién sueña con imágenes distantes, inconexas? Debido a ello, quizás, no tardaron en unirse y dar lugar a una secuencia, a una nueva <span class="italic">configuración</span> de la realidad. Como en este relato, les adelanto, era yo el único protagonista. </p>
                                                                                <p class="mainText">La película me mostró un paralelismo interesante, una alternativa concreta a la respuesta que había ya formulado en mi persona. Ahora, ¿era completamente necesario? En ocasiones, no me queda más que maldecir a este destino que parece decidido a arruinarme. Me observo en el espejo y no reconozco del todo a ese ente que me devuelve la mirada. Lo más llamativo es la falta de color, como si el sueño hubiese llegado con una paleta de blancos, una que absorbió la energía del ser del espejo y lo introdujo a un estado endeble, caótico, vulnerable. Observo el interior de la cabaña con animosidad y la encuentro: la maleta ya está hecha, me espera. ¿Y ahora? </p>
                                                                                <p class="mainText">Era tan sencillo como contestar, realizar la declaración. Introducirme en su historia, ser uno con su lírica, tomar la maleta y partir. Escribir las líneas que conozco de memoria y enviarlas, presionar un botón, ¿qué tal difícil puede ser? La respuesta está escrita en papel desde hace tiempo. Verán, la computadora es el único recurso que me involucra de manera mínima con la sociedad actual, la utilizo para conectarme —a mi ritmo—  con la vida moderna, pero si es por lo demás soy escritor vieja escuela. </p>
                                                                                <p class="mainText">Siempre así, ¿saben? Desde pequeño. Recuerdo en las asignaturas naturales: me colocan frente a situaciones tediosas al momento de clasificar. ¿Tiene escamas? Si las tenía, uno seguía a través de la primera senda. En cambio, si no las tenía, te desviabas hacia el camino número 2. En cada parada, aquello que llamábamos nodos —nudos no, nodos—, debía tomar una decisión que afectaría el trayecto restante. Malditos nodos. A pesar de que no se me daba tan mal este tipo de actividades —como deben estar suponiendo— reprobé en numerosas ocasiones la asignatura. Quizás fue mi forma de desquitarme, de hacer daño con herramientas que estuvieran a mi alcance. Una forma de protesta, ni más ni menos. </p>
                                                                                <p class="mainText">Si este relato se fraccionara en capítulos, la sección que procedo a comentarles se llamaría situación número 1. Está claro, ¿no? Hablaría de cómo presioné la tecla <span class="italic">send</span>, de la fuerza que imprimí al hacerlo y la sonrisa que apareció de manera súbita en mi semblante. Les contaría acerca de cómo tomé los pasajes —obtenidos con anterioridad, por supuesto— y los coloqué en mi bolsillo especial, el del pecho, sobre el centro pero más hacia la izquierda. Una llamada de teléfono, la maleta, una caminata de unos kilómetros hacia la ciudad, el transporte con destino claro, el de siempre, el que todos desean. Tan sencillo, tan humano, tan ideal. Novela promedio escrita por autor mediocre, ni más ni menos.</p>
                                                                                <p class="mainText">Y sin embargo aquí me encuentro, a la deriva en mis propios pensamientos. La diferencia entre ayer y presente no es nada sutil, se llama alternativa mucho gusto, para nada encantando de conocerte. El camino estaba claro, el camino era uno solo y ahora no lo es tanto. No soy un profundo estudioso de la psicología humana —de más está decir— y aun así he incorporado en el camino ciertas cuestiones relacionadas al sufrimiento de nuestra especie. Aquí seré muy claro, no voy a aburrirlos con tecnicismos inútiles ni teorías demasiado densas para su mente. Por ello, me resumiré a esta sencilla línea: <span class="italic">choosing sucks</span>, si me permiten el anglicismo. Una expresión en nuestra lengua no haría suficiente justicia al sentimiento.</p>
                                                                                <p class="mainText">Solicito tranquilidad y paciencia de su parte. Nunca tuve la intención de privarlos de la situación número 2, una en la que no presiono <span class="italic">send</span>, sino que imprimo una moderada cantidad de fuerza sobre la tecla <span class="italic">delete</span>, no sin antes haber seleccionado el texto completo, la declaración. Sin risas, sin pasajes. El bolsillo se encuentra roto, ya no sirve para contener ni para cuidar. Un giro en la novela, la alternativa, todo aquello que no había considerado. Salir del piloto automático. El modo manual asusta, me convierte en responsable de los actos. De si va bien, de si sale mal. También de si no va. La cabaña se vuelve cómoda, afuera hace frío y no dispongo de un abrigo.</p>
                                                                                <p class="mainText">Un atardecer maravilloso se dibuja sobre el horizonte. Este bello emplazamiento de madera lo ha sido todo durante demasiados años. En la playa no se encuentra un alma, yace delante con tranquilidad, como invitándome a recorrerla, a pasear por sus arenas. Creo conocer cada una de sus partículas, cada sencilla sombra que emerge de manera paralela al atardecer. ¿Me encuentro listo para venderlas al mejor postor? ¿Por promesas de buenos años, que desconozco si son tales? La cabaña irradia una luminosidad que nunca había sido capaz de percibir. Aquella maleta lista hace semanas, organizada con ahínco y casi perfecta minuciosidad, ahora pesa demasiado y es difícil de levantar. La entrada se alza sobre mí tan imponente, tan sagrada. ¿Y yo? Tan Impotente, pagano. Le atribuyo la culpa al sueño, que supo devenir de esta configuración. Malditos nodos. O, ¿malditos miedos? <span class="italic">Choosing sucks</span>.</p>
                                                                                <p class="mainText">Imagino que desean conocer cuál es el camino elegido. Les presenté dos situaciones. Se encuentran bien informados acerca del contexto, de las emociones que acompañan cada sendero. Por un lado, las promesas por cumplir y el cariño que me alcanzará cuando toque sus manos, el futuro perfecto e inexorable que deviene de abandonar la comodidad, la soledad absoluta. Por otro lado, el bolsillo roto, la tecla <span class="italic">delete</span> y todo lo que acontece a partir de ello: la luminosidad de la cabaña, la suavidad de las partículas de arena y las sombras que, paralelas, se dibujan en el atardecer. </p>
                                                                                <p class="mainText">¿Cuál es la respuesta? </p>
                                                                                <p class="mainText">Al parecer, la respuesta es la situación número tres. ¿Cómo? Sí, la tres, también conocida como ninguna de las anteriores. Para mayor claridad, puedo describirles mi proceso mental: iba a ser uno, sueño con dos, sufro por ambas y escojo la tres, sin saberlo.  La situación número tres es una extensión de la dos pero con retoques importantes. Me explico. Elijo la cabaña. La playa, la arena, la soledad. El bolsillo roto, todo aquello que aconteció en mi sueño. Por unos instantes, sentí que estaba decidiendo, que superaba con sobresaliente esa maldita evaluación de ciencias naturales en la secundaria. El sueño había ganado, me hacía responsable de mi vida y de mis decisiones. Lo que descubro, solo unos instantes después de reflexionar, es que la imagen que acompaña esta <span class="italic">configuración</span> es un enorme castillo de naipes, tan endeble que bastan dos segundos para derribarlo hasta sus mismos cimientos. ¿Dónde quedó la luminosidad? La arena son partículas, sedimentos provenientes de una lejana playa que no reconozco como mía. La sensación de pertenencia ha desaparecido. Presiento que el sol se esconderá durante mucho tiempo, quizás para siempre. Sin atardeceres, ni sombras proyectadas. Todo debido a un maldito nodo, a una evaluación de la secundaria, a una decisión. </p>
                                                                                <p class="mainText">Son ávidos lectores, lo puedo ver. Como ávidos que son, entiendo, debería haberlos escuchado más. Quizás, después de todo, incluso podrían haber elegido por mí. Haber reescrito esta historia, ¿por qué no? Ahora es tarde y lo sabemos. Verán, esa es la cuestión acerca de las elecciones: uno dispone de cierta información previa, se generan conjeturas, se toma una decisión —en el mejor de los casos— y boom. No hay vuelta atrás. Incluso si caen en una alternativa que no se encontraba entre las opciones, debido a que no supieron reconocerla, como en este caso.  </p>
                                                                            </div>
                                                                        </article>`)

const licenciaTemporal = new Story("Licencia temporal", "licenciaTemporal", "Nicolás Setzes", 132, 2016,  `<article class="shortStory">
                                                                                                            <h3>Licencia temporal</h3>
                                                                                                            <div class="columns">
                                                                                                                <p class="mainText">La versión que alcancé a mis allegados era que le llevó solo un minuto de su tiempo. En la oficial, le bastaba con solo quince segundos. En la real, dos eran más que suficientes.</p>
                                                                                                                <p class="mainText">Hay una versión más, pero me quedo sin tiempo porque me avisan al oído que no corre hacia atrás. No existe el tiempo negativo, en retroceso el límite es el cero y se acabó esa historia de volver.</p>
                                                                                                                <p class="mainText">No escogería a un matemático —ni a un físico, ni a un biólogo— para explicarles que debe haber algo más, una licencia temporal. Esto me permitiría establecer cierto patrón, una secuencia temporal por debajo de la nada que me alcance para hablar de ese momento, instante, situación en que la vi en su inmensidad y sin saberlo, me lo robó.</p>
                                                                                                            </div>
                                                                                                        </article>`)

const iutopia = new Story("Iutopía", "iutopia", "Nicolás Setzes", 273, 2020, `<article class="shortStory">
                                                                                <h3>Iutopía</h3>
                                                                                <div class="columns">
							                                                        <p class="mainText">Nunca falta el pez que dentro del cardumen nada en contra de la corriente, desoyendo los gritos de la inmensa mayoría. Un caso así fue el reportado en <span class="italic">Iutopía</span>, un pueblito rural de México que en el padrón consta de mil ochocientos habitantes en sus filas, pero no supera las setecientas almas en sus calles. </p>
							                                                        <p class="mainText">La historia cuenta que los hombres de <span class="italic">Iutopía</span> no conocen las artes de la dominancia. A pesar de que sus vigorosos vientres, sus bigotes de la mafia y sus andares despreocupados reflejan altas similitudes con los de la capital, en sus casas estos hombres –si pueden llamarse hombres– acatan las decisiones de la prójima sin chistar. Para el de afuera, ver cómo estos sementales evalúan si repasar la cocina con limón o lavanda puede resultar un escenario de lo más extraño. También es válido considerar a los hombres de Iutiopía como verdaderos valientes, solo un hombre muy seguro de su masculinidad tiene el coraje necesario para vestir un delantal con semejante estampado. </p>
							                                                        <p class="mainText">Los hombres de <span class="italic">Iutopía</span> abrazan la ideología y no se ruborizan al sostenerla públicamente; ellos no lo saben pero deberían agradecer que la difusión del pueblo no es muy efectiva –siempre y cuando quieran seguir manteniendo la paz con las ciudades vecinas–. </p>
							                                                        <p class="mainText">Es un secreto a voces: María Guadalupe de los Santos, veintinueve añitos, nacida y criada en <span class="italic">Iutopía</span>, piensa aspirar a la presidencia con la misión de transmitir estos ideales a las demás regiones. Esperemos, por el bien de Iutiopía y de la mismísima María Guadalupe de los Santos, que su misión no supere el padrón de los mil ochocientos habitantes. </p>
						                                                        </div>
                                                                            </article>`)

const simulacro = new Story("Simulacro", "simulacro", "Nicolás Setzes", 646, 2014, `<article class="shortStory">
                                                                                        <h3>Simulacro</h3>
                                                                                        <div class="columns">
                                                                                            <p class="mainText">Una habitación. La luz que entra tímidamente permite entrever a una mujer de andar pausado con bastón. El incesante golpeteo se encarga de inundar el aire del cuarto, vacío a pesar de su presencia. Pareciera no saber quién es, ni cómo llegó hasta allí. Sus manos inusitadamente blancas acompañan el ritmo, al contrario de sus pies que se van deteniendo lentamente. Su juventud está bien disimulada en su pelo que alguna vez fue oro, pero hoy se muestra de plata y delgado. La mujer dibuja la expresión más alegre que puede evocar, va esquivando las velas remanentes de la noche anterior que le dan a la habitación cierto aire de tenebrosidad. </p>
                                                                                            <p class="mainText">Mira por la ventana, pensativa. Se avecina una tormenta de verano y sonríe cómplice, después de todo una promesa es una promesa. El cristal de la copa le devuelve un reflejo inacabado, senil. Abre las ventanas del comedor y siente la brisa, le refresca. Le recuerda que es muy afortunada, una en un millón. Piensa que la ironía y la desgracia son compañeras de ruta muy descaradas, grandes cómplices. Cierra los ojos un momento y los recuerdos la inundan, le demuestran su cercanía al sabor metálico, el estruendo, la sirena y el final. Un brusco movimiento de hombros le devuelve a la normalidad, transpirando se sienta unos minutos a descansar. La vida solo le da unos minutos esta vez, dado que comienza a sonar su teléfono y una melodía clásica hace eco en cada rincón.  </p>
                                                                                            <p class="mainText">Su marido ha sido visitado por alguien más y con violencia. Es requerida su presencia en el lugar del entierro y la firma de ciertos documentos. Su propio cuerpo le pesa ahora más que nunca. El sabor metálico, el estruendo, todo el contenido del baúl vuelve a visitarla y a producirle un nuevo escalofrío, el segundo del día. </p>
                                                                                            <p class="mainText">El debate interno es breve. Una promesa es una promesa, sí, pero esta circunstancia se enmarca dentro de lo excepcional. Coquetea unos instantes con sus llaves, que bailan inertes sobre sus agrietados dedos. Novecientos días son una inmensidad. </p>
                                                                                            <p class="mainText">El clima es húmedo pero le da igual. Ni su marido la reconocería, caminando con la cara repleta y con un pronunciado atropello, intentando encontrar la dirección. Las líneas paralelas de la vereda se asemejan al primer tramo de su vida. Las baldosas y su corte rectangular representan los límites de sus posibilidades, la muerte ya asumida de su libre albedrío. </p>
                                                                                            <p class="mainText">El problema no solo está en su mente, sino que la sonrisa social demanda una cantidad de energía muy superior a la natural, a aquella que abundaba cuando los tiempos eran mejores y no había ni sirenas ni final. </p>
                                                                                            <p class="mainText">A estas alturas, el llanto no es demasiada sorpresa. El agua ocular escapa a gran velocidad, ansiosa por liberarse de su recinto. No se organizan en fila —como uno esperaría en emergencias de este calibre—sino que huyen despavoridas, escapan agitadamente como quien se aleja de una explosión.</p>
                                                                                            <p class="mainText">Apoya el bastón en su lugar habitual y se sienta con dificultad. A pesar de la experiencia, lo familiar le devuelve a la vida y detiene su llanto en seco. Su pecho acompaña con pausa tanto a su inhalación como a su exhalación, los tiempos que las separan están calculados y en momentos como este mejor no dejar nada al azar. Al abrir la mirada y levantar la vista, observa el teléfono y comprende de inmediato que fue este el causante de sus males. Lo positivo —razona— es que el teléfono es más vulnerable que la muerte y bastan dos movimientos para ser retirado de la ecuación indefinidamente. Un atisbo de sonrisa se dibuja en su semblante, al fin. Un movimiento de la mano y se acabaron sus problemas. Reconoce el aroma de su casa, los restos de las velas de la noche anterior. Tranquilidad. Ahora sí que todo está bien, todo vuelve a ser normal.</p>
                                                                                        </div>
                                                                                    </article>`)

const volarAlto = new Story("Volar alto", "volarAlto", "Nicolás Setzes", 455, 2020,  `<article class="shortStory">
                                                                                        <h3>Volar alto</h3>
                                                                                        <div class="columns">
							                                                                <p class="mainText">Luces. <span class="italic">Pink Floyd</span>. Un libro de <span class="italic">Murakami</span>, <span class="italic">Tokyo blues</span>. La ventana permanece abierta. Me invita, me seduce hablando  el idioma que compartimos, un dialecto sin palabras. Estoy a punto de soñar. Abandono el libro en la 291, lo dejo boca arriba en mi cama —me gusta la fotografía— y me incorporo, despacio, sin hacer ruido. Debo culpar a <span class="italic">Meddle</span> por el estado de transición que me domina, en especial a su súper famoso <span class="italic">b-side</span>. En cámara lenta, cumplo con el cometido y asomo la cabeza. Un viento que no es brisa, que es valiente, me despeina con violencia. Se lleva algunos temores, una parte de lo que soñaba hace rato cuando yacía medio muerto sobre el colchón, sin sábanas —nunca con sábanas— porque en verano hace calor y el metabolismo hace de las suyas con mi cuerpo, siempre.</p>
							                                                                <p class="mainText">Noche. Trece pisos. La Av. Colón iluminada, bellísima. Como una montaña rusa, levanta y se pierde de vista. Los vehículos que se suben no abonan —es gratis— pero, ¡menudo viaje! Los hay de todo tipo, todo color. Todo a voluntad de un hombre que no para de construir.</p>
							                                                                <p class="mainText">¿Gente? Poca. Casi nadie. Algunos <span class="italic">nobodies</span> me imitan, pero no disfrutan la noche. No sienten el aire. No respiran. No escuchan la música. No siguen la montaña rusa. Son autómatas que salen solo porque hay que salir. Luego entran, porque deben entrar. Así de automático todo, sin vueltas. Sin detenerse a preguntar, ¿por qué?</p>
							                                                                <p class="mainText">¿Por qué hago cada una de las cosas que hago? </p>
							                                                                <p class="mainText">¿Yo? Me encuentro en un firme deseo de volar. Nada como un buen balcón para ello. Para emprender un súbito viaje hacia mí mismo. Todo para encontrarme. Conocerme. Vencer a los <span class="italic">nobodies</span>. Navegar a través de la densidad, de la complejidad. Alcanzar un final, una conclusión válida.</p>
							                                                                <p class="mainText">Respiro aire. <span class="italic">Meddle</span>. Vuelo.</p>
							                                                                <p class="mainText">El viaje se extiende más de lo que esperaba, el aire golpea mi rostro, sigue despeinándome, voy a altas velocidades. Los acordes se distorsionan, las luces se van extinguiendo.</p>
							                                                                <p class="mainText">Solo las estrellas permanecen. </p>
							                                                                <p class="mainText">Algún vecino grita por algún motivo. Quizás se les escapa el perro. Dejo atrás mis creencias, mis pertenencias, mis amigos, mi familia, los <span class="italic">nobodies</span>, ¿o eran los <span class="italic">nobodaddys</span>? ¿De quién estábamos hablando?</p>
							                                                                <p class="mainText">La velocidad es muy alta. Demasiado. Un mareo ligero. Intento grabar en mi retina la luz de una estrella. Cierro los ojos. Solo me queda esperar el impacto… que no llega nunca. La realidad decidió salir del escondite, otra vez (demasiado pronto).</p>
							                                                                <p class="mainText">Apago el cigarrillo arrimándolo contra la pared. Entro con cuidado y me vuelvo a acostar. El tacto de mi propia piel me supera. Soy otro. Quizás un poco más sabio. No lo sé bien.</p>
							                                                                <p class="mainText">Inhalo, exhalo. <span class="italic">Meddle</span>. Vuelvo a <span class="italic">Murakami</span>. Volé. Sí, un viaje increíble.</p>
						                                                                </div>
                                                                                    </article>`)

const allaArriba = new Story("Allá arriba", "allaArriba", "Nicolás Setzes", 600, 2020,    `<article class="shortStory">
                                                                                            <h3>Allá arriba</h3>
                                                                                            <div class="columns">
							                                                                    <p class="mainText italic">“La tierra que nos han dado está allá arriba”</p>
							                                                                    <p class="mainText">De Juan Rulfo, <span class="italic">“Nos han dado la tierra”. “El llano en llamas” (1953)</span>.</p>
							                                                                    <p class="mainText">–Anda y no anda, mi ángel. Todos vivimos y morimos, pero lo más terrible sabe qué es? Un desaparecido, porque también vive y muere, pero lo hace al mismo tiempo. </p>
							                                                                    <p class="mainText">La nona no hizo más que subir las escaleras jadeando, para entregarse al sueño de las cuatro. </p>
							                                                                    <p class="mainText">–Te voy a pedir lo más importante: tu palabra –utilizó uno de sus últimos aires del día para esto–. No te acercarás a la Guada, ni a su dolor. </p>
							                                                                    <p class="mainText">El ángel no suele entender cuando la nona explica, en especial cuando habla de la Guada, pero sintió la necesidad de registrar la pregunta: “lo que no se dice no existe”, le dice la nona siempre que se acuerda. La Guada sigue sentada en su entrada con la mirada gacha, aunque de vez en cuando discute breve con el cielo y baja, como cada día. El ángel ya la había visto, sí, pero no sabe qué es lo que dice, o con quién habla, y la nona no lo sabe tampoco y le jura y re jura que no es asunto suyo.</p>
							                                                                    <p class="mainText">El ángel la estudia mientras se toma el mate cocido que aprendió a prepararse solo. La calle es azotada por un torrencial y la Guada permanece como cada día. Sus ojos son pequeños, el ángel no distingue y quiere verlos de cerca, saber qué esconden y qué es lo que anhelan. Un registro que explique la razón de su inmutable paciencia. Antes de darse cuenta, ya recorrió la mitad de la cuadra y le ofrece un sorbo de mate cocido, aunque la Guada está mirando el suelo y no repara en su acercamiento.</p>
							                                                                    <p class="mainText">La lluvia no calma y el ángel ha convertido su travesura en ritual. Siempre que el reloj marca las cuatro y algo, va con su mate cocido y ofrece a la Guada, que sin embargo parece no escucharlo. La Guada no ha comido durante años y aunque el ángel nota que no lo requiere, un sorbo de mate cocido no le viene mal a nadie con este clima. Aun así, la Guada no lo mira.</p>
							                                                                    <p class="mainText">La paliza de su vida, tanto que casi se queda sin alas. El ángel calla porque sabe a qué vienen los golpes y promete con su boca que no sucederá otra vez, aunque su corazón sonría cómplice indicando lo contrario. La nona, que siempre vio a través de su piel, sabe que no hay nada para hacer: los golpes magullan el cuerpo, sí, pero difícilmente alcanzan el alma.</p>
							                                                                    <p class="mainText">Las siestas de la nona se acortan pero el ángel resulta indomable, presiente que un día viernes sería diferente y vaya si no erra que va al encuentro de la Guada sin mate cocido, pero con el corazón entre sus manos. La Guada está conversando con el cielo y todavía no ha bajado, es interrumpida por un ángel que aprovecha la situación y encuentra la mirada de la Guada por primera vez. La Guada alterna rápidamente su vista entre el ángel y el cielo con inesperada sorpresa y comprende con asombro.</p>
							                                                                    <p class="mainText">La nona siente cómo la entrada de la Guada ahora se encuentra inmersa en el silencio. El sueño de las cuatro le reveló lo ocurrido: un ángel tomó a la Guada por la mano y ambos se elevaron hasta perderse. No hay sorpresas, todo sucedió como se suponía y ahora que la Guada se ha llenado de calma al fin, la nona –entre lágrimas– entiende que finalmente es su turno para descansar.</p>
						                                                                    </div>
                                                                                        </article>`)

const fueraDeTiempo = new Story("Fuera de tiempo", "fueraDeTiempo", "Nicolás Setzes", 356, 2021, `<article class="shortStory">
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

const jardin = new Story("Jardín", "jardin", "Nicolás Setzes", 238, 2020, `<article class="shortStory">
                                                                                <h3>Jardín</h3>
                                                                                <div class="columns">
							                                                        <p class="mainText">Señora vestido a flores se dirige hacia soga del jardín, no ha puesto su mano en el broche y vecina saluda animadamente, también va a colgar la ropa. Medias van primero y del lado del sol pues secan más rápido pero vecina inicia con saco grueso de hombre porque prioridad. Vecina pregunta por Romeito, anda excelente, medias de señora se elevan en el jardín y comienzan a secar, vecina no empieza porque clasifica broches por color y demora, señora ya va por bombachas y toma delantera. La organización cromática es deleite, nada mal vecina, nada mal, pero señora aprieta mandíbula y acelera, no será bonito pero será primera y se convence de que eso es lo que realmente. Retrovisor muestra vecina que gana velocidad y mantiene estética intacta, toma curvas con inteligencia y no pierde paso, brillo del sol parece que no afecta y en qué momento colgó todas sus remeras. Señora respira fuerte y siente sangre en la garganta, prendas que intenta se caen y comienza a perder el control, decepción y saco de hombre que todavía no encaró y la curva que viene es muy peligrosa y vecina parece decidida, sangre fría corre por sus venas. Vecina se despide porque está cansada y señora cuelga el saco de hombre y necesita descansar porque sabe qué pasó, sabe por qué derrota y lo sabe para la próxima: a veces no competir es la mejor manera de ganar.</p>
						                                                        </div>
                                                                            </article>`)


const laViola = new Story("La viola", "laViola", "Nicolás Setzes", 238, 2014, `<article class="shortStory">
                                                                                    <h3>La viola</h3>
                                                                                    <div class="columns">
                                                                                        <p class="mainText">Unas notas, en compás. Talento inusitado, como de cuna. Día comienza mas afuera un ocaso brillante. Necesita cambio. Se obliga salir y comenzar pues el oficio no permite. Avanza, avanza, retrocede. La viola. Lo considera una señal de que será distinto. La llegada es como si nunca. Señal. Toca en mismo compás y aclaman, miradas vuelan y audiencia delira. Sin duda es uno con la viola, domina la maestría de ser con ella. Su amor. Se espera en revistas y diarios como el gran músico que demostró. Denota que le pesa la presión de aparentar. Cambio.</p>
                                                                                        <p class="mainText">Retorna con gloria, aunque no tanto. Los pensamientos se le arremolinan como cuando un tornado. Es un viaje largo, tal cual travesía. Siente poder degollar con mirada asesina. Siente culpable por lluvia ácida. A kilómetros, luz interrumpe. Se le viene ballena más grande y atardecer rojo. Recuerda las señales. Plantas próximas a la ruta intentan escape por aullido atroz. La maldita noche lo quiere atrapar, a su ser ha descubierto. Auto abandonado, ahora parsimonia al caminar por la banquina y descubrir silueta esbelta, tímida, sóla. Pregunta dirección con cuidado, confía y se va. La experiencia le ayuda, sabe cómo es. Avanza, avanza, retrocede y la viola, la viola, la viola. La luna sin intención revela detalles como si crítico musical estuviera. Se pregunta si, se contesta no. Entusiasmado corre, pues se sabe más vivo que nunca. El personaje cayó, la persona no.</p>
                                                                                    </div>
                                                                                </article>`)

const cuestionDeTiempo = new Story("Cuestión de tiempo", "cuestionDeTiempo", "Nicolás Setzes", 921, 2017,   `<article class="shortStory">
                                                                                                                <h3>Cuestión de tiempo</h3>
                                                                                                                <div class="columns">
                                                                                                                    <p class="mainText">La mirada de mi mamá es idéntica a la mía. Unos días atrás mi tío —su hermano— me explicó la razón. Usó palabras que no conocía, como “genética” y “herencia”. Creo que sabe mucho debido a su profesión. Es maestro. Para variar, mamá tenía razón: ellos saben todo. Cuando crezca, quiero convertirme en maestra y saber tanto como él. Al comentarles de mi plan, su respuesta fue “hay que estudiar mucho Mili”. Aun así, no me importa. Quiero saber cómo funcionan las cosas. El por qué detrás de las ventanas, cómo dejan pasar la luz. Por qué cuando me duermo, despierto. Por qué la mirada de mi mamá es como la mía. Ah, sí, lo había olvidado. La mirada de mi mamá es como la mía. O la mía como la suya. Aun así, de a ratos se dan diferencias. Mi mamá a veces llora. Cada vez con más frecuencia. Solo puedo pensar en por qué se encuentra tan triste en estos últimos días. </p>
							                                                                                        <p class="mainText">Creo que todo comenzó el día que leyó mi carta. Sí, lo recuerdo bien. Era viernes. Mi maestra —como mi tío, lo sabe todo— nos encomendó una tarea para el fin de semana. Según ella, ayudaría a mejorar la manera en que escribimos. La idea era tomar un lápiz y escribir unas líneas acerca de alguien que amemos mucho. También nos comentó que podíamos dibujar sobre un recuerdo con esa persona. Tras un momento, pensé en lo obvio: mi mamá. Alguien que amo y me cuida siempre. A su vez, tenía muchos recuerdos lindos con ella. Creía estar decidida, hasta que observé que todos mis compañeros iban a escribir sobre su mamá. Cuando comenté esto a mi maestra, me recomendó hacerlo sobre mi papá, pero resulta que yo no tengo. Me miró de manera extraña —no alcancé a comprenderla— y a continuación me sugirió que lo hiciera acerca de otro familiar. No era necesario dedicarle demasiado tiempo, la elección era obvia. Mi tío, el maestro que sabe todo, era como mi papá. Sin tiempo que perder, comencé.     </p>
							                                                                                        <p class="mainText">Al cabo de unos minutos, estaba listo. No quedó espacio para un dibujo, pero no me importaba: todo estaba en las palabras. Muy emocionada, radiante por la tarea cumplida, se lo mostré a mi mamá. Debo admitir que no alcancé a comprender su reacción. En primer lugar sus lágrimas. Es cierto que ella misma me había comentado que a veces la gente lloraba de felicidad. Debe ser eso. Lo que no me explico es por qué se llevó su mano a la boca. Su cuerpo parecía más pequeño de lo normal. También dejó caer la taza de té al suelo. Todo era extraño. Solo había escrito unas líneas, pero ella continuó por un rato interminable. Hacía oídos sordos a mi insistencia, no había nada que deseara más que saber qué le parecía. No había caso. Seguía con esa mirada extraña. Le temblaba la voz, pero logró pedirme que vaya a mi cuarto de inmediato. Estaba asustada. Me dio un abrazo rápido y me acompañó. </p>
							                                                                                        <p class="mainText">Estuve sola por una hora. Me entretuve espiando por la ventana. El sol se escondía y en ese mismo instante lo vi, mi tío llegaba de trabajar. Agite mis brazos con insistencia, pero no me vio. Intenté abrir la ventana sin éxito, demasiado pesada para mis pequeños brazos. Decidí esperar a que me viera. Nunca ocurrió. Mi mamá salió corriendo desde la puerta principal, aun con mi carta en sus manos. Nunca la había visto así. Me pareció ver que el patio se inundaba con sus lágrimas, que la ventana temblaba con sus gritos. Ahora que lo pienso, quizá era debido a los míos. No pude hacer otra cosa que contemplar sin poder hacer nada, mientras mi mamá intentaba sujetarlo, golpearlo, dañarlo. ¡A mi tío! Tal como hacía yo en mis berrinches, pero aún más. Quería defenderlo, pedir ayuda, pero estaba encerrada y no sabía qué hacer. Al rato se acercaron mis vecinos y ya no alcanzaba a distinguir. Lo próximo que recuerdo es estar en los brazos de mi mamá. A pesar de su calidez, la retaba por golpear a mi tío. Ella me abrazaba y lloraba. Desde ese día que no cesa de llorar. Cada día un rato, aun cuando cree que no la veo. No lo entiendo. Esta es otra razón —la más importante— por la que quiero convertirme en maestra como mi tío y saber todo. Para entender. No comprendo por qué mi mamá lo golpearía, cuando siempre fue tan cariñoso conmigo. Lo recuerdo todo, sus abrazos y caricias, sus besos. Había ratos que no dejaba de mirarme y me recordaba lo hermosa que era. No voy a mentir, a veces molestaba, pero cuando se lo decía, él iba más lento y me aseguraba que todo estaría bien. “Todo es una cuestión de tiempo” —me decía siempre— aunque no me guste pensar en esto porque mi mamá me dijo que no lo volveré a ver. No lo entiendo. Me duele. Odio un poco a mi mamá. Ella dice que tiene sus razones. Espero que lo perdone y vuelva a nuestras vidas. Lo extraño. Tengo esperanza de que vuelva. Él me dijo que es lo último que se pierde. Sí, él, quien lo sabe todo. Mi mamá no me devolvió la carta. Aun después de insistir tanto. No quería que mi maestra pensara que no lo había hecho. No quería que me pusiera mala nota. No queda alternativa, tendré que escribir otra. Solo espero que no ocasione los problemas que causó la anterior.</p>
						                                                                                        </div>
                                                                                                            </article>`)

const shortStories = [sinEmbalar, dePaso, nodos, licenciaTemporal, iutopia, simulacro, volarAlto, allaArriba, fueraDeTiempo, jardin, laViola, cuestionDeTiempo]  // Defino un array que contendrá los cuentos (stories) completos

// Declaro una función que me permitirá mostrar un cuento según la temática escogida por el usuario:

const showStory = (pick) => {
    const filtered = shortStories.filter(a => a.value === pick)
    $("#storyText").html(filtered[0].text)
}

// Declaro la función callback que me permitirá 1) reconocer la temática escogida por el user y 2) ejecutar la función showStory()

const storyPick = () => {
    let pick = document.getElementById('selectStories').value
    showStory (pick)
}


