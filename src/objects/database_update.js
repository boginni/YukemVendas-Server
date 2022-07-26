class DatabaseVersion {
    /**
     * @type {string}
     */
    version
    template
    /**
     * @type {DatabaseSql[]}
     */
    dlls
}

class DatabaseSql{
    /**
     * @type {string}
     */
    name;
    /**
     * @type {string}
     */
    sql;
}