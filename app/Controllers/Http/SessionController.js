'use strict'

const Env = use('Env')

const User = use('App/Models/User')
// const Invite = use('App/Models/Invite')

var soap = require('soap')

class SessionController {
  async store ({ request, response, auth }) {
    // const { email, password } = request.all()
    // const token = await auth.attempt(email, password)
    // return token

    // example url
    var url = `${Env.get('SOAP_URL')}/wsEdu.asmx?wsdl`

    const { Login, senha } = request.all()

    await soap.createClient(url, function (err, client) {
      // client.setSecurity(new soap.BasicAuthSecurity(Env.get('SOAP_USER'), Env.get('SOAP_PASSWORD')))
      if (err) {
        console.log('Client error: ', err)
        return response.json({ message: 'Not OK' })
      } else if (client) {
        // console.log(client)
        return client.AutenticarSenhaUsuario({ Login, senha }, function (err2, result) {
          // console.log(result)
          if (err2) {
            console.log('Function err: ', err2)
            return response.json({ message: 'Not OK' })
          } else if (result) {
            // console.log('result: ', result)
          }
        })
      }
    })

    const data = { name: 'Pedro', email: 'pedro1.wallaus@liceufranco.g12.br', password: 'hjhdjadhadha' }

    const teams = [1]

    if (teams.length === 0) {
      return response
        .status(401)
        .send({ message: "You're not invited to any team." })
    }

    const user = await User.create(data)

    await user.teams().attach(teams)

    // await teamsQuery.delete()

    const token = await auth.generate(user)
    // const token = await auth.attempt(data.email, data.password)
    console.log(token)
    return token
  }
}
module.exports = SessionController
