# Starting an EMR job with Boto

@meta publishDatetime 2013-07-11T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/07/starting-emr-job-with-boto.html

I've noticed there are not many articles about boto and Amazon web services. Although boto's documentation is quite good, it lacks some practical examples. Most specifically, I found quite a fair amount of RTFM was needed to get an elastic map reduce job started on Amazon using Boto (and I did it from Google app engine, just to go full cloud!). So here it goes, a very basic EMR job launcher using boto:

```c++
zone_name = 'eu-west-1'
access_id = ...
private_key = ...

# Connect to EMR
conn = EmrConnection(access_id, private_key,
                    region=RegionInfo(name=zone_name,
                    endpoint= zone_name + '.elasticmapreduce.amazonaws.com'))

# Create a step for the EC2 instance to install Hive
args = [u's3://'+zone_name+'.elasticmapreduce/libs/hive/hive-script',
            u'--base-path', u's3://'+zone_name+'.elasticmapreduce/libs/hive/',
            u'--install-hive', u'--hive-versions', u'0.7.1']
start_jar = 's3://'+zone_name+ \
            '.elasticmapreduce/libs/script-runner/script-runner.jar'
setup_step = JarStep('Hive setup', start_jar, step_args=args)

# Create a jobflow using the connection to EMR and specifying the
# Hive setup step
jobid = conn.run_jobflow(
                    "Hive job", log_bucket.get_bucket_url(),
                    steps=[setup_step],
                    keep_alive=keep_alive, action_on_failure='CANCEL_AND_WAIT',
                    master_instance_type='m1.medium',
                    slave_instance_type='m1.medium',
                    num_instances=2,
                    hadoop_version="0.20")

# Set the termination protection, so the job id won't be killed after the
# script is finished (that way we can reuse the instance for something else
# Don't forget to shut it down when you're done!
conn.set_termination_protection(jobid, True)

s3_url = 'Link to a Hive SQL file in S3'
args = ['s3://'+zone_name+'.elasticmapreduce/libs/hive/hive-script',
        '--base-path', 's3://'+zone_name+'.elasticmapreduce/libs/hive/',
        '--hive-versions', '0.7.1',
        '--run-hive-script', '--args',
        '-f', s3_url]

start_jar = 's3://'+zone_name+'.elasticmapreduce/libs/script-runner/script-runner.jar'
step = JarStep('Run SQL', start_jar, step_args=args)
conn.add_jobflow_steps(jobid, [step])
```

