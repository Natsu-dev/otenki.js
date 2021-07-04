/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('tenki', {
        id: 'id',
        area_code: {
            type: 'string'
        },
        area_name: {
            type: 'string',
            notNull: true
        },
        publishing_office: {
            type: 'string',
            notNull: true
        },
        report_datetime: {
            type: 'timestamp',
            notNull: true
        },
        time_define : {
            type: 'timestamp'
        },
        weather_code : {
            type: 'string',
            notNull: true
        },
        pop : {
            type: 'string',
            notNull: true
        },
        reliability : {
            type: 'string',
            notNull: true
        },
        temp_min : {
            type: 'string',
            notNull: true
        },
        temp_min_lower : {
            type: 'string',
            notNull: true
        },
        temp_min_upper : {
            type: 'string',
            notNull: true
        },
        temp_max : {
            type: 'string',
            notNull: true
        },
        temp_max_lower : {
            type: 'string',
            notNull: true
        },
        temp_max_upper : {
            type: 'string',
            notNull: true
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    }, {
        constraints: {
            unique: ['area_code', 'time_define']
        }
    });
};

exports.down = pgm => {};
