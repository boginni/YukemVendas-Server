class HistoricoPedido{
    pessoas;
    data;
    filtrar_data;
    completo;
}

//select * from mob_vw_historico_pedido a
//where  a.id_cliente in (select * from SP_UTIL_INTEGER_LIST(:N) )
//order by a.id_cliente, id