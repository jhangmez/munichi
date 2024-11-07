export function getSelectedModel(): string {
  if (typeof window !== 'undefined') {
    const storedModel = localStorage.getItem('selectedModel')
    return storedModel || 'hf.co/unprg/Llama-3.2-1B-MuniCHI:Q4_K_M'
  } else {
    // Default model
    return 'hf.co/unprg/Llama-3.2-1B-MuniCHI:Q4_K_M'
  }
}
