import log from 'npmlog'
import {getSrcPaths} from '../common'
import {PotExtractor} from '../pot-extractor'
import fs from 'fs'
import * as path from "path"

export default async function (domainName, config, potPath) {
    const srcPaths = await getSrcPaths(config, ['.js', '.ts', '.tsx', '.jsx'])
    const keywords = config.get('keywords')

    const extractor = PotExtractor.create(domainName, {keywords})
    log.info('extractPot', 'extracting from .js, .ts, .tsx, .jsx files')
    for (const srcPath of srcPaths) {
        log.verbose('extractPot', `processing '${srcPath}'`)
        const ext = path.extname(srcPath)
        if (ext === '.js' || ext === '.jsx') {
            const input = fs.readFileSync(srcPath, {encoding: 'UTF-8'})
            extractor.extractReactJsModule(srcPath, input)
        } else if (ext === '.ts' || ext === '.tsx') {
            const input = fs.readFileSync(srcPath, {encoding: 'UTF-8'})
            extractor.extractTsModule(srcPath, input)
        } else {
            log.warn('extractPot', `skipping '${srcPath}': unknown extension`)
        }
    }
    fs.writeFileSync(potPath, extractor.toString())
}
