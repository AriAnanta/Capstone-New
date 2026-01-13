<?php

namespace App\Console\Commands;

use App\Models\LlmRecommendation;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CleanMalformedRecommendations extends Command
{
    protected $signature = 'recommendations:clean-malformed
                          {--dry-run : Show what would be cleaned without actually doing it}
                          {--force : Force cleanup without confirmation}';

    protected $description = 'Clean up malformed LLM recommendations that contain raw JSON or incomplete responses';

    public function handle()
    {
        $this->info('Scanning for malformed LLM recommendations...');

        $query = LlmRecommendation::where(function($q) {
            $q->where('pertimbangan_llm', 'like', '%{"summary":"%')
              ->orWhere('pertimbangan_llm', 'like', '%{"articles"%')
              ->orWhere('pertimbangan_llm', 'like', '%```%')
              ->orWhereRaw('JSON_VALID(pertimbangan_llm) = 1');
        });

        $count = $query->count();

        if ($count === 0) {
            $this->info('No malformed recommendations found.');
            return 0;
        }

        $this->warn("Found {$count} potentially malformed recommendations.");

        if ($this->option('dry-run')) {
            $recommendations = $query->get(['id', 'pertimbangan_llm', 'perkara_id']);
            
            $this->table(
                ['ID', 'Perkara ID', 'Preview'],
                $recommendations->map(function ($rec) {
                    return [
                        $rec->id,
                        $rec->perkara_id,
                        Str::limit($rec->pertimbangan_llm, 50),
                    ];
                })
            );
            
            $this->info('This was a dry run. Use --force to actually clean the data.');
            return 0;
        }

        if (!$this->option('force') && !$this->confirm("Do you want to clean {$count} malformed recommendations?")) {
            $this->info('Cleanup cancelled.');
            return 0;
        }

        $updated = $query->update([
            'pertimbangan_llm' => 'Ringkasan ini telah diperbaiki oleh sistem. Silakan proses ulang dokumen untuk mendapatkan analisis yang lebih akurat.',
            'meta->status' => 'cleaned',
            'meta->cleaned_at' => now()->toISOString(),
        ]);

        $this->info("Successfully cleaned {$updated} recommendations.");
        $this->info("These recommendations now show a placeholder message. Users can reprocess the documents to get fresh analysis.");

        return 0;
    }
}