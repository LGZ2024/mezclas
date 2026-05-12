// JavaScript fixes para problemas de escalado en servidor

document.addEventListener('DOMContentLoaded', function() {
    // Detectar y corregir problemas de escalado
    function fixScalingIssues() {
        // Resetear zoom y transformaciones no deseadas
        const body = document.body
        const html = document.documentElement

        // Asegurar dimensiones correctas
        body.style.transform = 'scale(1)'
        body.style.zoom = '1'
        body.style.width = '100vw'
        body.style.maxWidth = '100vw'
        body.style.overflowX = 'hidden'

        html.style.transform = 'scale(1)'
        html.style.zoom = '1'
        html.style.width = '100vw'
        html.style.maxWidth = '100vw'

        // Corregir contenedores principales
        const containers = document.querySelectorAll('.container, .contenedor, .main-content')
        containers.forEach(container => {
            container.style.transform = 'none'
            container.style.zoom = '1'
            container.style.scale = '1'
            container.style.width = '100%'
            container.style.maxWidth = '100%'
        })

        // Corregir modales
        const modals = document.querySelectorAll('.modal')
        modals.forEach(modal => {
            modal.style.transform = 'none'
            modal.style.zoom = '1'
            modal.style.scale = '1'
        })

        // Corregir formularios
        const forms = document.querySelectorAll('form')
        forms.forEach(form => {
            form.style.transform = 'none'
            form.style.zoom = '1'
            form.style.scale = '1'
        })

        // Corregir select2 si existe
        const select2Containers = document.querySelectorAll('.select2-container')
        select2Containers.forEach(container => {
            container.style.transform = 'none'
            container.style.zoom = '1'
            container.style.scale = '1'
            container.style.width = '100%'
        })

        // Corregir stepper específico de fertilización
        const stepper = document.querySelector('.stepper-container')
        if (stepper) {
            stepper.style.transform = 'none'
            stepper.style.zoom = '1'
            stepper.style.scale = '1'
            stepper.style.width = '100%'
        }

        console.log('Scaling fixes applied')
    }

    // Aplicar fixes inmediatamente
    fixScalingIssues()

    // Aplicar fixes después de cargar completamente
    window.addEventListener('load', fixScalingIssues)

    // Aplicar fixes cuando cambia la orientación
    window.addEventListener('orientationchange', function() {
        setTimeout(fixScalingIssues, 100)
    })

    // Aplicar fixes cuando cambia el tamaño de la ventana
    window.addEventListener('resize', function() {
        clearTimeout(window.resizeTimer)
        window.resizeTimer = setTimeout(fixScalingIssues, 250)
    })

    // Detectar si estamos en modo PWA standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
        document.body.classList.add('pwa-standalone')
        fixScalingIssues()
    }

    // Corregir problemas específicos de iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.classList.add('ios-device')

        // Prevenir zoom en inputs
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="number"], textarea, select')
        inputs.forEach(input => {
            input.style.fontSize = '16px'
            input.addEventListener('focus', function() {
                document.body.style.position = 'fixed'
                document.body.style.width = '100%'
                document.body.style.height = '100%'
            })

            input.addEventListener('blur', function() {
                document.body.style.position = ''
                document.body.style.width = ''
                document.body.style.height = ''
            })
        })
    }

    // Corregir problemas específicos de Android
    if (/Android/.test(navigator.userAgent)) {
        document.body.classList.add('android-device')
        fixScalingIssues()
    }

    // Detectar problemas de zoom del navegador
    const zoomLevel = window.outerWidth / window.innerWidth
    if (zoomLevel < 0.9 || zoomLevel > 1.1) {
        console.warn('Zoom level detected:', zoomLevel)
        fixScalingIssues()
    }

    // Observar cambios en el DOM para aplicar fixes a elementos nuevos
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Aplicar fixes a nuevos elementos si es necesario
                        if (node.classList && (node.classList.contains('modal') || node.classList.contains('select2-container'))) {
                            setTimeout(fixScalingIssues, 50)
                        }
                    }
                })
            }
        })
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true
    })

    // Exponer función global para debugging
    window.fixScaling = fixScalingIssues

    console.log('Scaling fixes initialized')
})

// Aplicar fixes también cuando el documento está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(window.fixScaling, 100)
    })
} else {
    setTimeout(window.fixScaling, 100)
}
