function updateClasses() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const elements = document.querySelectorAll('[class*="-md-"], [class*="-sm-"], [class*="-lg-"], [class*="-xl-"]');

    elements.forEach(element => {
        let classList = element.className.split(' ');

        // Reset the class to its base state by removing any -sm-, -md-, -lg-, or -xl- classes
        classList = classList.map(cls => {
            return cls.replace(/-(sm|md|lg|xl)-/, '-md-');
        });

        // Apply the appropriate class based on the aspect ratio
        classList = classList.map(cls => {
            if (cls.includes('-md-')) {
                if (aspectRatio < 0.7) {
                    return cls.replace('-md-', '-sm-');
                } else if (aspectRatio >= 0.7 && aspectRatio < 1.2) {
                    return cls.replace('-md-', '-md-');
                } else if (aspectRatio >= 1.2 && aspectRatio < 1.7) {
                    return cls.replace('-md-', '-lg-');
                } else if (aspectRatio >= 1.7) {
                    return cls.replace('-md-', '-xl-');
                }
            }
            return cls;
        });

        // Reapply the updated class list to the element
        element.className = classList.join(' ');
    });

    if (document.getElementsByClassName('fullPageText').length > 0) {
        document.getElementsByClassName('fullPageText')[0].style.minHeight = window.innerHeight - document.getElementsByClassName('layout_header__blB6l')[0].clientHeight - document.getElementsByClassName('layout_footer__hVpBj')[0].clientHeight
    }
}

window.addEventListener('resize', updateClasses);
window.addEventListener('load', updateClasses);

if (!localStorage.getItem('visited')) {
    document.getElementById('popup').style.display = 'flex';
    localStorage.setItem('visited', 'true');
}

document.getElementById('close-popup').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'none';
});