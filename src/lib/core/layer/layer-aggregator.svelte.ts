export class LayerAggregator {
  static #instance: LayerAggregator;
  static getInstance() {
    if (!this.#instance) this.#instance = new LayerAggregator();
    return this.#instance;
  }

  #layers: any[] = $state([]);

  add(layer: any) {
    this.#layers.push(layer);
  }
  remove(layer: any) {
    const id = layer.getId();
    this.#layers = this.#layers.filter((l) => l.getId() !== id);
  }
  getAll() {
    return this.#layers;
  }
  setZIndexPosition(layer: any, index: number) {
    this.#layers = this.#layers
      .filter((l) => l !== layer)
      .splice(index, 0, layer);
  }

  processAudioAll() {
    return Promise.all(
      this.#layers.map(async (l) => {
        if (!l.processAudio) return;
        return l.processAudio();
      })
    );
  }
  renderAll() {
    this.#layers.forEach((l) => {
      l.render();
    });
  }
}
