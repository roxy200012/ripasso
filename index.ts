import fastify from 'fastify';
import * as mysql from 'mysql';
const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});
var connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Vmware1!',
    database: 'ripasso'
})
interface IParams {
    id: string;
}
interface Ibody {

    name: string;
    price: string;
}
//get Lista
app.get('/acquisti', (request, reply) => {
    connection.query('select * from acquisti', (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send();
        }
        reply.send(results);
    })
})
// get by id
app.get<{ Params: IParams }>('/acquisti/:id', (request, reply) => {
    connection.query('select * from acquisti where id=?', [request.params.id], (error, results, fields) => {
        if (results.length == 0) {
            reply.status(404).send();
        }
        else
            reply.send(results[0])
    })
})
// inserimento
app.post<{ Body: Ibody }>('/acquisti', (request, reply) => {
    connection.query('insert into acquisti (name,price) values(?,?)', [request.body.name, request.body.price], (error, results, fields) => {

        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }

        app.log.info('Inserimento riuscito!');
        reply.status(200).send();


    })
})
// modifica elemento
app.put<{ Params: IParams, Body: Ibody }>('/acquisti/:id', (request, reply) => {
    connection.query('update acquisti set price=? where id=?', [request.body.price, request.params.id], (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(304).send({ message: error.message })
            return;
        }
        else reply.status(200).send({ message: 'modificato prezzo del prodotto n°' + request.params.id });
    })
})
// cancellazione elemento
app.delete<{ Params: IParams }>('/acquisti/:id', (request, reply) => {

    connection.query('delete  from acquisti where id=?', [request.params.id], (error, results, fields) => {

        if (error) {
            reply.status(500).send({ message: error.message })
            return
        }
        else reply.status(200).send('prodotto cancellato')
    });

})
app.listen(3000,(err, address) =>{
    if (err) throw err
    app.log.info('server listening on' + address)
});