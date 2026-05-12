document.addEventListener('DOMContentLoaded', function() {
// eslint-disable-next-line no-undef
const usuario = localStorage.getItem('usuario')
const usuarioParsed = JSON.parse(usuario)
switch (usuarioParsed.rol) {
    case 'master':
        // mostrar todos los modulos
        document.getElementById('modulo_fertilizacion').style.display = 'block'
        document.getElementById('modulo_catalogos_corporativos').style.display = 'block'
        // mostrar los demas modulos dentro del modulo de fertilizacion
        document.getElementById('modulo_fertilizacion').querySelectorAll('li').forEach(function(li) {
            li.style.display = 'block'
        })
        // mostrar los demas modulos dentro del modulo de catalogos corporativos
        document.getElementById('modulo_catalogos_corporativos').querySelectorAll('li').forEach(function(li) {
            li.style.display = 'block'
        })
        break
    case 'inocuidad':
        document.getElementById('modulo_fertilizacion').style.display = 'block'
        document.getElementById('modulo_mezclas').style.display = 'block'
        document.getElementById('modulo_registrar_aplicacion').style.display = 'block'
        document.getElementById('modulo_reportes').style.display = 'block'
        break
    case 'produccion':
        document.getElementById('modulo_fertilizacion').style.display = 'block'
        document.getElementById('modulo_mezclas').style.display = 'block'
        document.getElementById('modulo_preparar_tanque').style.display = 'block'
        document.getElementById('modulo_reportes').style.display = 'block'
        break
    default:
        // mostrar error
        break
}
})
