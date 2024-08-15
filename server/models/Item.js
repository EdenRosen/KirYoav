module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define("Item", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tableData: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.BLOB,
        },
        likes: {
            type: DataTypes.STRING,
        },
    })

    Item.associate = models => {
        Item.belongsTo(models.Category)
    }

    return Item
}