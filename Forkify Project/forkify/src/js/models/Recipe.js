import axios from "axios";
export default class Recipe{
    constructor(id){
        this.id = id;
    }
    async getRecipe(){
        try {
        const ress = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);  
        this.title =  ress.data.recipe.title;
        this.auther = ress.data.recipe.publisher;
        this.img = ress.data.recipe.image_url;
        this.url = ress.data.recipe.publisher_url;
        this.ingrediant = ress.data.recipe.ingredients;
        // console.log(ress);    
        } catch (error) {
            console.log(error);
           alert('Something went wrong !');
        }
    }
    calcTime(){
        const numInt = this.ingrediant.length;
        const period = Math.ceil(numInt / 3)
        this.time = period * 15;
    }
    calcServing(){
        this.serving = 4;
    }
    parseIngrediant(){
        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitsShort, 'kg', 'g'];
        const newIngrediant = this.ingrediant.map(element => {
            let ingrediant = element.toLowerCase();
            unitsLong.forEach((unit, i ) => {
                ingrediant = ingrediant.replace(unit, unitsShort[i]);
            });
            // let arrIng;
            //remove paranthasis 
            ingrediant = ingrediant.replace(/ *\([^)]*\) */g, '');
            const arrIng = ingrediant.split(' ');
            const unitIndex = arrIng.findIndex(e12 => unitsShort.includes(e12));
            let objIng;
            if(unitIndex > -1){
                 const arrCount =arrIng.slice(0, unitIndex)
                 let count;
                 if(arrCount.length === 1){
                    count = arrIng[0].replace('-','+');
                 }
                 else{
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                 }
                 objIng = {
                    count,
                    unit:arrIng[unitIndex],
                    ingrediant:arrIng.slice(unitIndex + 1) .join(' ')
                 }
            }
            else if(parseInt(arrIng[0], 10)){
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit:'',
                    ingrediant:arrIng.slice(1) .join(' ')
                }
            }
            else if(unitIndex === -1){
                objIng = {
                    count: 1,
                    unit:'',
                    ingrediant
                }
            }
            return objIng;
        });
        
        this.ingrediant = newIngrediant;
    }
    updateServing(type) {
        const newServing = type = 'dec' ? this.serving - 1 : this.serving + 1;
        this.ingrediant.forEach(ing => {
            ing.count *= (newServing / this.serving)
        });
        this.serving = newServing;
    }
}
