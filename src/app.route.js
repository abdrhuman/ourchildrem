import authRouter from './modules/user/user.router.js'
import foundPersonRoutes from './modules/person/foundPersonRoutes.js'
import lostPersonRoutes from './modules/person/lostPersonRoutes.js' ; 
import { deleteFoundPerson, getAllFoundPersons } from './modules/person/foundPersonController.js';
import router from './modules/person/foundPersonRoutes.js';
import { getAllLostPersons } from './modules/person/lostPersonController.js';

export const appRouter = (app,express)=>{
    app.use(express.json())


    app.use("/auth",authRouter)
    

    
    ///found person
    app.use("/person",foundPersonRoutes)
    app.use('/getFound', getAllFoundPersons);
    app.delete("/deletPersons/:id", deleteFoundPerson);


    
    
    

    app.use("/person", lostPersonRoutes);
    app.use('/lostPerson', getAllLostPersons);
    




    /// global eror handle

    app.use((error, req, res, next) => {
        const statusCode = error.status || 500; // استخدام خاصية status بدلاً من cause
        return res.status(statusCode).json({ success: false, message: error.message, stack: error.stack });
    });
    

}
export default router;