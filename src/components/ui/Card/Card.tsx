import { cn } from '@/lib/utils';
import type{ReactNode} from 'react';


interface CardProps {
    className?:string;
    children?:ReactNode;
}
interface CardBodyProps{
    className?:string;
    children?:ReactNode;
}
interface CardFooterProps{
    className?:string;
    children?:ReactNode;
}
export const Card = ({className,children}:CardProps) => {
  return (
    <div className={
        cn(
            'rounded-xl shadow-sm',className
        )
    }>
        {children}
       
    </div>
  )
}

export const CardHeader=()=>{
    return(
        <div>

        </div>
    )
}
export const CardBody=({className,children}:CardBodyProps)=>{
    return(
        <div className={
            cn(
                '',className
            )
        }>
                {children}
        </div>
    )
}

export const CardFooter=({className,children}:CardFooterProps)=>{
    return(
        <div className={
            cn(
                '',className
            )
        }>
            {children}

        </div>
    )
}
