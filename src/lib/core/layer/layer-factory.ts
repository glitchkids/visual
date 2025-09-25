class LayerNotFound extends Error {
  name = "LayerNotFound";
}

export function createLayerFactory(layers: Record<string, any>) {
  return class LayerFactory {
    static instance: LayerFactory;
    static getInstance() {
      if (!this.instance) this.instance = new LayerFactory();
      return this.instance;
    }

    #layers: Record<string, any>;
    constructor() {
      this.#layers = layers;
    }

    create(type: string) {
      if (!(type in this.#layers)) throw new LayerNotFound();

      return new this.#layers[type]();
    }
    getAllName() {
      return Object.keys(this.#layers);
    }
  };
}
