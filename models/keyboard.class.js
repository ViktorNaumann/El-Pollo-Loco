class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    deactivate() {
        // Event-Listener entfernen, falls sie gespeichert wurden
        if (this.keydownListener) {
            window.removeEventListener('keydown', this.keydownListener);
        }
        if (this.keyupListener) {
            window.removeEventListener('keyup', this.keyupListener);
        }
        
        // Oder alternativ: Flag setzen, dass Eingaben ignoriert werden
        this.deactivated = true;
    }

    bind() {
        this.keydownListener = (e) => {
            if (this.deactivated) return; // Frühzeitiger Return wenn deaktiviert
            
            // Restlicher Event-Handler-Code...
        };
        
        this.keyupListener = (e) => {
            if (this.deactivated) return; // Frühzeitiger Return wenn deaktiviert
            
            // Restlicher Event-Handler-Code...
        };
        
        window.addEventListener('keydown', this.keydownListener);
        window.addEventListener('keyup', this.keyupListener);
    }
}