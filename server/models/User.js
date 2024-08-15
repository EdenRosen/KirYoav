module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profile: {
            type: DataTypes.BLOB,
        },
        phone: {
            type: DataTypes.STRING,
        },
        bio: {
            type: DataTypes.STRING,
        },
    })

    User.associate = models => {
        User.hasMany(models.Shop, {
            onDelete: 'cascade'
        })
    }

    return User
}