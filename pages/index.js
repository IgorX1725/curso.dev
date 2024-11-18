const Home = ()=>{
    const homeMessage = process.env.NEXT_PUBLIC_MESSAGE
return <h1>{homeMessage}</h1>
}

export default Home