declare var module: any;
declare var require: any;
declare var __dirname: any;
var yosay = require('yosay');
var fs = require('fs');
var path = require('path');
var generators = require('yeoman-generator');
import * as chalk from 'chalk';
import * as ejs from 'ejs';
var mkdirp = require('mkdirp');
var rmdir = require('rimraf');
/**
 * @module Angular 2 [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.Base.extend({
    prompting: function() {
        this.options.clients = this.config.get('clients') || {};
        let done = this.async();
        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'What\'s the name of your application?',
            default: 'universalapp'
        }/*, {
      type    : 'confirm',
      name    : 'universal',
      message : 'Would you like to enable Angular Universal?'
    }*/]).then(function(answers: { name: string, universal: boolean }) {
                if (this.options.clients[answers.name]) {
                    this.log(chalk.red(`\n\nThere is already an application using the name ${answers.name}`));
                    done();
                } else {
                    this.log(chalk.green(`\n\nCreating new Angular 2 Application: ${answers.name}`));
                    let nmdir: string = require.resolve('angular-cli').replace(/angular-cli(\/|\\)lib(\/|\\)cli(\/|\\)index.js/, '');
                    let clicmd: string = path.join(nmdir, '.bin/ng');
                    let args: string[] = ['new', answers.name];
                    if (answers.universal) { args.push('--universal'); }
                    this.spawnCommand(clicmd, ['new', answers.name], { shell: true })
                        .on('exit', (code: number) => {
                            if (code === 0) {
                                this.options.current = answers.name;
                                this.options.clients[answers.name] = {
                                    path: `./${answers.name}`,
                                    type: 'ng2universal'
                                }
                                this.config.set('clients', this.options.clients);
                            } else {
                                this.log(chalk.green(`\nApplication Status Code: ${code}\n`));
                            }
                            done();
                        });
                }
            }.bind(this));
    },

    buildsdk: function() {
        if (this.options.current) {
            this.composeWith('fireloop:sdk', {
                options: {
                    clientPath: path.join(this.options.clients[this.options.current].path, 'src/app/shared/sdk'),
                    serverPath: this.options.serverPath
                }
            });
        }
    },

    install: function() {
        let dest = this.destinationPath(this.options.current);
        if (this.options.current) {
            this.spawnCommand(
                `npm`, [
                    'install', '--save',
                    'socket.io-client',
                    'express',
                    'angular2-express-engine',
                    'angular2-platform-node',
                    'angular2-universal',
                    'angular2-universal-polyfills',
                ], {
                    cwd: dest
                });
            this.spawnCommand(
                `npm`, [
                    'install', '--save-dev', 
                    '@types/socket.io-client',
                    '@types/express'
                    ], {
                    cwd: dest
                });
        } else {
            this.log(chalk.red(`\nUnable to install socket io lib: ${this.options.current}\n`));
        }
    },

    copyTemplates: function() {
        var _this = this;
        mkdirp(this.destinationPath(this.options.current + "/src/universal"));
        rmdir.sync(this.destinationPath(this.options.current + "/src/app/app.module.ts"));
        if (this.options.current) {
            [
                {
                    template: 'templates/universal/app.browser.module.ts',
                    output: this.options.current + "/src/universal/app.browser.module.ts",
                    params: {}
                },
                {
                    template: 'templates/universal/app.node.module.ts',
                    output: this.options.current + "/src/universal/app.node.module.ts",
                    params: {}
                },
                {
                    template: 'templates/universal/client.ts',
                    output: this.options.current + "/src/universal/client.ts",
                    params: {}
                },
                {
                    template: 'templates/universal/polyfills.browser.ts',
                    output: this.options.current + "/src/universal/polyfills.browser.ts",
                    params: {}
                },
                {
                    template: 'templates/universal/polyfills.node.ts',
                    output: this.options.current + "/src/universal/polyfills.node.ts",
                    params: {}
                },
                {
                    template: 'templates/universal/resource-loader.ts',
                    output: this.options.current + "/src/universal/resource-loader.ts",
                    params: {}
                },
                {
                    template: 'templates/universal/server.ts',
                    output: this.options.current + "/src/universal/server.ts",
                    params: {}
                },
                {
                    template: 'templates/universal/tsconfig.json',
                    output: `${this.options.current}/src/tsconfig.json`,
                    params: {}
                },
            ].forEach(function(config) {
                console.info('Generating: %s', "" + config.output);
                // Not Using this.fs because asking the user for these replacements
                // Is not needed.
                fs.writeFileSync(_this.destinationPath(config.output), ejs.render(fs.readFileSync(path.join(__dirname, '..', '..', config.template), { encoding: 'utf-8' }), config.params));
            });
        }
    }

});