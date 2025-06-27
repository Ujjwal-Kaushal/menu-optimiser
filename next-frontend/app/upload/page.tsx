import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import axios from "axios";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const { getUser, isAuthenticated } = getKindeServerSession()
  const isAuthed = await isAuthenticated();
  if (!isAuthed) {
    redirect("/")
  }
  const user = await getUser();
  // try {
  //   const addUserToDB = await axios.post(`http://localhost:3001/user/create`, {
  //     name: `${user?.given_name} ${user?.family_name}`,
  //     email: user?.email,
  //     authID: user?.id

  //   })
  //   console.log(addUserToDB);
  // } catch (error) {
  //   console.log("Erro")
  // }

  const addUser = await fetch("http://localhost:3001/user/create", {
    method: "POST",
    body: JSON.stringify({
      name: "Mahendra dani",
      email: user?.email,
      authID: user?.id
    })
  })
  console.log("Workiing")
  console.log(addUser);


  return (
    <>
      <div>upload image from here</div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>

  )
}