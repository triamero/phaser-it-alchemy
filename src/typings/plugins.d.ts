declare namespace Phaser {

    interface Scene {
        rexUI: RexUIPlugins;
    }
}

interface RexUIPlugins {
    add: RexUIGameObjectFactory;
}


interface RexUIGameObjectFactory {
    label(): any;
}

