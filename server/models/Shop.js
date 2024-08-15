module.exports = (sequelize, DataTypes) => {
    const Shop = sequelize.define("Shop", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        texts: {
            type: DataTypes.STRING,
        },
        style: {
            type: DataTypes.STRING,
        },
        banner: {
            type: DataTypes.BLOB,
        },
        logo: {
            type: DataTypes.BLOB,
        },
        icon: {
            type: DataTypes.BLOB,
        },
    })

    Shop.associate = models => {
        Shop.hasMany(models.Item, {
            onDelete: 'cascade'
        })
    }

    return Shop
}