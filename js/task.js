/**
 * Une genre de machine à état qui permet de gérer les différentes phases
 * du jeu.
 */
export class TaskManager{
    #task

    set task(value){
        if(this.#task){
            this.#task.stop(this)
        }

        this.#task=value
        if(this.#task){
            this.#task.start(this)
        }
    }

    get task(){ return this.#task }

    tick(){
        if(this.task){
            if(this.task.doRun(this)){
                this.task.tick(this)
            }
            else this.task=undefined
        }
    }
}

export class BaseTask{
    stop(manager){}
    start(manager){}
    doRun(manager){return true}
    tick(manager){}
}