import java.io.concurrent.semaphore;

public class Q {
    int n;
    static semaphore semCon=new semaphore(0);
    static semaphore ssemProd=new semaphoe(1);

    public void get(){
        try{
            semaCon.acquire();
        }catch(interruptedExcwption e){

        }
    }
}
