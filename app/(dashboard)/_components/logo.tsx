import Image from 'next/image'

const Logo = () => {
  return (
    <Image alt='Logo' src="/logo.svg" height={130} width={130}/>
  )
}

export default Logo