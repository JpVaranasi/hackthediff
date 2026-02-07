export type Club = {
    id:number
    name:string
    lat:number
    long:number
    tags:string[]//nullable
    training_days:string[]//nullable
    postcode:int //Nullable
    address:string,//nullable
    httpspicture:string
}

//EGAMPLE>{"name":"Abergavenny RFC","lat":null,"long":null,"tags":null,"training_days":null,"postcode":null,"address":null,"httpspicture":"https://public.wru.wales/organisation/logos/Abergavenny RFC.png"}
export const clubs:Club[]=[
    {
        id:1,
        name:"Cardiff RFC",
        lat:51.4816,
        long:-3.1791,
        tags:["play","inclusive"],
        training_days:["Tuesday,Thursday"],
        postcode:null,
        address:null,
        httpspicture:"https://public.wru.wales/organisation/logos/Bettws-RFC.png",//EG
    },
    {
        id:2,
        name:"Penarth RFC",
        lat:51.4816,
        long:-3.1791,
        tags:["play","volunteer"],
        training_days:["Monday,Thursday"],
    },
    {
        id:3,
        name:"Newport RFC",
        lat:51.4816,
        long:-3.1791,
        tags:["play","inclusive"],
        training_days:["Tuesday,Thursday"],
    }
]
