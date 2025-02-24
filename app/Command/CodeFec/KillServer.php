<?php

declare(strict_types=1);

namespace App\Command\CodeFec;

use Hyperf\Command\Command as HyperfCommand;
use Hyperf\Command\Annotation\Command;
use Psr\Container\ContainerInterface;

/**
 * @Command
 */
#[Command]
class KillServer extends HyperfCommand
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;

        parent::__construct('CodeFec:KillsServer');
    }

    public function configure()
    {
        parent::configure();
        $this->setDescription('Kill CodeFec Server');
    }

    public function handle()
    {
        if(file_exists(BASE_PATH."/runtime/hyperf.pid")){
            exec("kill ".BASE_PATH."/runtime/hyperf.pid");
        }
        $this->line('Successfully', 'info');
    }
}
