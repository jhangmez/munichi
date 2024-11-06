interface ModelInfo {
  nombre_comercial: string
  model_id: string
  nombre_original_modelo: string
  descripcion: string
  status: string
  link_hf: string
  base_model: string
}

export const INITIAL_MODELS: ModelInfo[] = [
  {
    nombre_comercial: 'MuniCHI',
    model_id: 'hf.co/unprg/Llama-3.2-1B-MuniCHI:BF16',
    nombre_original_modelo: 'Llama-3.2-1B-MuniCHI:BF16',
    descripcion:
      'Modelo optimizado para responder preguntas en general sobre la Municipalidad de Chiclayo',
    status: 'activo',
    link_hf: 'https://huggingface.co/unprg/Llama-3.2-1B-MuniCHI',
    base_model: 'Llama 3.2 1B'
  }
]
