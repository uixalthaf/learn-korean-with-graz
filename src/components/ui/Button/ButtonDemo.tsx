import { Button } from "./Button";

type ButtonDemoProps={
    name:string;
}

const ButtonDemo=(
    {name}:ButtonDemoProps
)=>{
    return(
        <>
        <Button onClick={()=>alert('buttotn has been clicked')} >
            {name}
            </Button>

        </>
    )
}
export default ButtonDemo;