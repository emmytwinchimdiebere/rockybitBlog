import {create} from  "zustand"


const  useStore =  create((set:any)=>({
    bears:0,
    incrementPopulation:()=>set((state:any)=>({bears:state.bears + 1})),
    updateBears:()=>set((newBear:any)=>({bears:newBear})),
    removeBears:()=>set(()=>({bears:0}))
}))

export default useStore;