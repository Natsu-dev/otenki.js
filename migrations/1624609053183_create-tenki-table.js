/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('tenki', {
        id: 'id',
        area_code: {
            type: 'string',
            notNull: true,
        },
        publishing_office: {
            type: 'string',
            notNull: true,
        },
        report_datetime: {
            type: 'timestamp',
            notNull: true,
            default: true
        },
        date_define : {
            type: 'timestamp',
            notNull: true,
            default: false
        },
        weather_code : {
            type: 'string',
            notNull: true,
            default: false
        },
        pop : {
            type: 'string',
            notNull: true,
            default: false
        },
        reliability : {
            type: 'string',
            notNull: true,
            default: false
        },
        temp_min : {
            type: 'string',
            notNull: true,
            default: false
        },
        temp_min_lower : {
            type: 'string',
            notNull: true,
            default: false
        },
        temp_min_upper : {
            type: 'string',
            notNull: true,
            default: false
        },
        temp_max : {
            type: 'string',
            notNull: true,
            default: false
        },
        temp_max_lower : {
            type: 'string',
            notNull: true,
            default: false
        },
        temp_max_upper : {
            type: 'string',
            notNull: true,
            default: false
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};

exports.down = pgm => {};
